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

    snsPublish('In employeeFunc...', {arn: 'arn:aws:sns:us-east-1:099711494433:LambdaTest'});

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
                    delete my_rows[row]["companyId"];
                    break;
                  }
                }
                for (person in body2) {
                  if (body2[person].id==my_rows[row].personId) {
                    my_rows[row]["person"] = body2[person].firstname + " " + body2[person].lastname;
                    my_rows[row].personLink = {
                      href: 'http://person-env.n924wyqpyp.us-east-1.elasticbeanstalk.com:8000/person/' + my_rows[row]["personId"]
                    }
                    delete my_rows[row]["personId"];
                    break;
                  }
                }
                my_rows[row].self = {
                  href: 'https://0j1j9o13l2.execute-api.us-east-1.amazonaws.com/prod/employeeFunc2/' + my_rows[row]['employeeId']
                }
              }
              callback(null, {
                statusCode: '200',
                body: JSON.stringify(my_rows),
                headers: {
                  'Content-Type': 'application/json',
                  'etag': etag(my_rows)
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
            if(event.path == '/employeeFunc2'){
                console.log("IN GET");
                var my_rows;
                // let secondpormm = new Promise(function(resolve, reject) {
                // });

                let firstpormmm = new Promise(function(resolve, reject) {
                    connection.query("SELECT * from employee", function (error, rows) {
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
            } else if(event.path.includes('/employeeFunc2/page/')){
                    console.log("IN PAGE");
                    console.log(event.path.substr(event.path.lastIndexOf("/") + 1))
                    var my_rows;
                    let firstpormmmPage = new Promise(function(resolve, reject) {
                        connection.query("SELECT ROUND(a.totalPages/5,0) as totalPages, employee.* from (select count(*) as totalPages from employee) as a, employee LIMIT "+(event.path.substr(event.path.lastIndexOf("/") + 1)*5)+", 5",  function (error, rows) {
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
            } else if(event.path.includes('/employeeFunc2/')){ // this is for /companyFunc/:id
              console.log("IN getting company ID");
              console.log(event.path.substr(event.path.lastIndexOf("/") + 1))
              var my_rows;
              let firstpormmmPage = new Promise(function(resolve, reject) {
                  connection.query("SELECT * from employee WHERE employeeId=?", event.path.substr(event.path.lastIndexOf("/") + 1),  function (error, rows) {
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
            snsPublish('In employeeFunc: POST', {arn: 'arn:aws:sns:us-east-1:099711494433:LambdaTest'});
            connection.query("INSERT INTO company (name, address, type, contactName, phone, fax) VALUES (?, ?, ?, ?, ?, ?)", [event.body.name, event.body.address, event.body.type, event.body.contactName, event.body.phone, event.body.fax], function (error, rows) {
                console.log(error);
                console.log(rows);
                callback(null, {
                    statusCode: error ? '400' : '200',
                    // body: err ? err.message : JSON.stringify(res),
                    body: JSON.stringify("Success!"),
                    headers: {
                        'Content-Type': 'application/json',
                        'etag': etag(rows)
                    }
                });
            });
            break;
        case 'PUT': // this is for PUT on companyFunc/:id
         console.log("IN PUT");
            snsPublish('In employeeFunc: PUT', {arn: 'arn:aws:sns:us-east-1:099711494433:LambdaTest'});
            var my_rows;
            let putCompanyPromise = new Promise(function(resolve, reject) {

            var compData = JSON.parse(event.body);
            console.log(compData.name);
            connection.query("UPDATE employee SET name=?, address=?, type=?, contactName=?, phone=?, fax=? WHERE employeeId=?", [event.body.name, event.body.address, event.body.type, event.body.contactName, event.body.phone, event.body.fax, event.path.substr(event.path.lastIndexOf("/") + 1)], function (error, rows) {
                  console.log(error);
                  console.log(rows);
                  my_rows = rows;
                  if (!error) {
                      connection.end();
                      resolve(1);
                    }
                });
            });
            putCompanyPromise.then(function() {
              console.log(my_rows);
              callback(null, {
                  statusCode: '200',
                  // body: err ? err.message : JSON.stringify(res),
                  body: JSON.stringify(my_rows),
                  headers: {
                      'Content-Type': 'application/json',
                      'etag': etag(my_rows)
                  }
              })
            });
        default:
            console.log("IN DEFAULT");
            done(new Error(`Unsupported method "${event.httpMethod}"`));
    }
});
};
