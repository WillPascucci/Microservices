'use strict';

console.log('Loading function');
// var express = require('express');
// var bodyParser = require('body-parser');
// var app = express();
var mysql = require('mysql');
var request = require('request');
var snsPublish = require('aws-sns-publish');
var etag = require('etag');

exports.handler = (event, context, callback) => {

  var connection = mysql.createConnection({
    host     : "assignmentpart2db.cyi40ipdvtjm.us-east-1.rds.amazonaws.com",
    user     : "microservices",
    password : "microservices",
    port     : 3306,
    database : "microservices"
  });

  connection.connect(function(errorfirst) {
    if (errorfirst) {
      console.error('Database connection failed: ' + errorfirst.stack);
      connection.end();
      return;
    }
    console.log('You are connected');

    snsPublish('In customerFunc...', {arn: 'arn:aws:sns:us-east-1:099711494433:LambdaTest'});

    const done = (err, res) => callback(null, {
      statusCode: err ? '400' : '200',
      body: err ? err.message : JSON.stringify(res),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    function getAllMethod(my_rows) {
          request('https://0j1j9o13l2.execute-api.us-east-1.amazonaws.com/prod/companyFunc', function (err, response, body) {
          request('http://person-env.n924wyqpyp.us-east-1.elasticbeanstalk.com:8000/person', function (err2, response2, body2) {
            console.log("IN START OF GET REQUEST GETMETHOD")
            if (err) {
              console.log(err);
              connection.end();
            }
            if (response.statusCode === 200 && response2.statusCode === 200) {
              body = JSON.parse(body);
              body2 = JSON.parse(body2);
              var row;
              for (row in my_rows) {
                var company;
                var person;
                for (company in body) {
                  if (body[company].id==my_rows[row].companyId) {
                    my_rows[row]["company"] = body[company].name;
                    my_rows[row].companyLink = {
                      href: 'https://0j1j9o13l2.execute-api.us-east-1.amazonaws.com/prod/companyFunc/' + my_rows[row]["companyId"]
                    }
                    break;
                  }
                }
                for (person in body2) {
                  if (body2[person].id==my_rows[row].personId) {
                    my_rows[row]["person"] = body2[person].firstname + " " + body2[person].lastname;
                    my_rows[row].personLink = {
                      href: 'http://person-env.n924wyqpyp.us-east-1.elasticbeanstalk.com:8000/person/' + my_rows[row]["personId"]
                    }
                    break;
                  }
                }
                my_rows[row].self = {
                  href: 'https://0j1j9o13l2.execute-api.us-east-1.amazonaws.com/prod/customerFunc2/' + my_rows[row]['customerId']
                }
              }
              callback(null, {
                statusCode: event.headers == null ? '200' : event.headers.etag == null  ? '200' : etag(JSON.stringify(my_rows)) == JSON.stringify(event.headers.etag) ? '304' : '200',
                body: JSON.stringify(my_rows),
                headers: {
                  'Content-Type': 'application/json',
                  'etag': etag(JSON.stringify(my_rows))
                }
              })
            } else {
              console.log(err);
              console.log(response);
              console.log(response.statusCode);
              console.log(body);
              console.log(err2);
              console.log(response2);
              console.log(response2.statusCode);
              console.log(body2);
            }
          });
          });
    }

    switch (event.httpMethod) {
      case 'GET':
      if(event.path == '/customerFunc2'){
        console.log("IN GET");
        var my_rows;
        // let secondpormm = new Promise(function(resolve, reject) {
        // });

        let firstpormmm = new Promise(function(resolve, reject) {
          connection.query("SELECT * from customer", function (error, rows) {
            my_rows = rows;
            if (!error) {
              connection.end();
              resolve(1);
            }
          });
        });
        firstpormmm.then(function() {
          return getAllMethod(my_rows);
        });
        break;
            } else if(event.path.includes('/customerFunc2/page/')){
                    console.log("IN PAGE");
                    console.log(event.path.substr(event.path.lastIndexOf("/") + 1))
                    var my_rows;
                    let firstpormmmPage = new Promise(function(resolve, reject) {
                        connection.query("SELECT FLOOR(a.totalPages/5) as totalPages, customer.* from (select count(*) as totalPages from customer) as a, customer LIMIT "+(event.path.substr(event.path.lastIndexOf("/") + 1)*5)+", 5",  function (error, rows) {
                          console.log(error);
                            console.log(rows);
                            my_rows = rows;
                            if (!error) {
                                connection.end();
                                resolve(1);
                            }

                        });
                    });
                    firstpormmmPage.then(function() {
                      return getAllMethod(my_rows);
                    });
            } else if(event.path.includes('/customerFunc2/')){ // this is for /companyFunc/:id
              console.log("IN getting customer ID");
              console.log(event.path.substr(event.path.lastIndexOf("/") + 1))
              var my_rows;
              let firstpormmmPage = new Promise(function(resolve, reject) {
                  connection.query("SELECT * from customer WHERE customerId=?", event.path.substr(event.path.lastIndexOf("/") + 1),  function (error, rows) {
                    console.log(error);
                      console.log(rows);
                      my_rows = rows;
                      if (!error) {
                          connection.end();
                          resolve(1);
                      }

                  });
              });
              firstpormmmPage.then(function() {
                return getAllMethod(my_rows);
              });
            }
            break;
        case 'POST':
            console.log("IN POST");
            var my_rows;
            var bod = JSON.parse(event.body);
            snsPublish('In customerFunc: POST', {arn: 'arn:aws:sns:us-east-1:099711494433:LambdaTest'});
            let postCustomerPromise = new Promise(function(resolve, reject) {
              connection.query("INSERT INTO customer (companyId, personId, dollarsSpent) VALUES (?, ?, ?)", [bod.companyId, bod.personId, bod.dollarsSpent], function (error, rows) {
                console.log(error);
                console.log(rows);
                my_rows = rows;
                if (!error) {
                    connection.end();
                    resolve(1);
                }
              });
            });
            postCustomerPromise.then(function() {
              console.log(my_rows);
              callback(null, {
                  statusCode: '200',
                  // body: err ? err.message : JSON.stringify(res),
                  body: JSON.stringify(my_rows),
                  headers: {
                      'Content-Type': 'application/json',
                      //'etag': etag(JSON.stringify(my_rows))
                  }
              })
            });
            break;
        case 'DELETE':
            console.log("IN DELETE");
            snsPublish('In customerFunc.: DELETE', {arn: 'arn:aws:sns:us-east-1:099711494433:LambdaTest'});
            var my_rows;
            let firstpormmm2 = new Promise(function(resolve, reject) {
                connection.query("DELETE from customer where customerId="+String(event.path.substr(event.path.lastIndexOf("/") + 1)), function (error, rows) {
                    console.log(error);
                    console.log(rows);
                    my_rows = rows;
                    if (!error) {
                        connection.end();
                        resolve(1);
                    }

                });
            });
            firstpormmm2.then(function() {
                console.log(my_rows);
                callback(null, {
                    statusCode: '200',
                    // body: err ? err.message : JSON.stringify(res),
                    body: JSON.stringify(my_rows),
                    headers: {
                        'Content-Type': 'application/json',
                      //  'etag': etag(JSON.stringify(my_rows))
                    }
                })
            });
            break;
        case 'PUT': // this is for PUT on companyFunc/:id
         console.log("IN PUT");
            snsPublish('In customerFunc: PUT', {arn: 'arn:aws:sns:us-east-1:099711494433:LambdaTest'});
            var my_rows;
            let putCustomerPromise = new Promise(function(resolve, reject) {
            var bod = JSON.parse(event.body);
            connection.query("UPDATE employee SET companyId=?, personId=?, dollarsSpent=? WHERE customerId=?", [bod.companyId, bod.personId, bod.dollarsSpent, event.path.substr(event.path.lastIndexOf("/") + 1)], function (error, rows) {
                  console.log(error);
                  console.log(rows);
                  my_rows = rows;
                  if (!error) {
                      connection.end();
                      resolve(1);
                    }
                });
            });
            putCustomerPromise.then(function() {
              console.log(my_rows);
              callback(null, {
                statusCode: event.headers == null ? '200' : event.headers.etag == null  ? '200' : etag(JSON.stringify(my_rows)) == JSON.stringify(event.headers.etag) ? '304' : '200',
                  // body: err ? err.message : JSON.stringify(res),
                  body: JSON.stringify(my_rows),
                  headers: {
                      'Content-Type': 'application/json',
                      'etag': etag(JSON.stringify(my_rows))
                  }
              })
            });
            break;
        default:
            console.log("IN DEFAULT");
            console.log(event.httpMethod);
            done(new Error(`Unsupported method "${event.httpMethod}"`));
    }
});
};
