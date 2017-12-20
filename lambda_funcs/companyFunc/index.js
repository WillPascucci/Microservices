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


  console.log(event.headers['idem-key'])
  connection.query("SELECT resp from idem where `key`=?", event.headers['idem-key'], function (error, rows) {
    console.log("in here...qwerty")
    console.log(error)
    console.log(rows)
    // idem_rows = rows;
    // if (!error) {
    //     connection.end();
    //     resolve(1);
    // }
    if (rows && rows != "null" && rows != "" && rows.length != 0) {
      console.log("in here...qwerty2")
      connection.end();
      callback(null, {
        statusCode: 200,
        body: JSON.stringify(rows),
        headers: {
          'Content-Type': 'application/json',
        }
      });
    } else {
      console.log("in else")


    snsPublish('In companyFunc...', {arn: 'arn:aws:sns:us-east-1:099711494433:LambdaTest'});

    const done = (err, res) => callback(null, {
        statusCode: err ? '400' : '200',
        body: err ? err.message : JSON.stringify(res),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    switch (event.httpMethod) {
        case 'GET':
          if(event.path == '/companyFunc' && event.queryStringParameters == null){
            console.log("IN GET");
            var my_rows;
            let getCompanyPromise = new Promise(function(resolve, reject) {
                connection.query("SELECT * from company", function (error, rows) {
                    console.log(error);
                    console.log(rows);
                    my_rows = rows;
                    if (!error) {
                        connection.end();
                        resolve(1);
                    }
                    console.log("after setting promise")

                });
            });
            console.log("before then")
            getCompanyPromise.then(function() {
                console.log(my_rows);
                callback(null, {
                    statusCode: '200',
                    // body: err ? err.message : JSON.stringify(res),
                    body: JSON.stringify(my_rows),
                    headers: {
                        'Content-Type': 'application/json',
                        'etag': etag(JSON.stringify(my_rows))
                    }
                })
            });
          } else if(event.path == '/companyFunc' && event.queryStringParameters != null){
              console.log("IN GET Query");
              // get query parameters
              /*var params = {}, queries, temp, i, l;
              // Split into key/value pairs
              queries = event.path.split("&");
              // Convert the array of strings into an object
              for ( i = 0, l = queries.length; i < l; i++ ) {
                  temp = queries[i].split('=');
                  params[temp[0]] = temp[1];
              }
              */
              var my_rows;
              console.log("before then")
              let getCompanyPromiseqry = new Promise(function(resolve, reject) {
                  var built_query = "SELECT * from company where 1=1";
                  console.log("here: "+built_query)
                  for(var key in event.queryStringParameters){
                    console.log("inside loop: "+built_query +"...."+key)
                    built_query += " and " + key +'="'+event.queryStringParameters[key]+'"';
                  }
                console.log("query: "+built_query);
                connection.query(built_query, function (error, rows) {
                      console.log(error);
                      console.log(rows);
                      my_rows = rows;
                      if (!error) {
                          connection.end();
                          resolve(1);
                      }
                      console.log("after setting promise")
                  });
              });
              getCompanyPromiseqry.then(function() {
                  console.log(my_rows);
                  callback(null, {
                      statusCode: '200',
                      // body: err ? err.message : JSON.stringify(res),
                      body: JSON.stringify(my_rows),
                      headers: {
                          'Content-Type': 'application/json',
                          'etag': etag(JSON.stringify(my_rows))
                      }
                })
            });
          } else if(event.path.includes('/companyFunc/page/')){
            console.log("IN PAGE");
            console.log(event.path.substr(event.path.lastIndexOf("/") + 1))
            var my_rows;
            let firstpormmmPage = new Promise(function(resolve, reject) {
                connection.query("SELECT FLOOR(a.totalPages/5) as totalPages, company.* from (select count(*) as totalPages from company) as a, company LIMIT "+(event.path.substr(event.path.lastIndexOf("/") + 1)*5)+", 5",  function (error, rows) {
                  console.log(error);
                    var r;
                    for (r in rows) {
                      rows[r]["selfPage"] = "https://0j1j9o13l2.execute-api.us-east-1.amazonaws.com/prod/companyFunc/page/" + event.path.substr(event.path.lastIndexOf("/")+1);
                      rows[r]["prevPage"] = "https://0j1j9o13l2.execute-api.us-east-1.amazonaws.com/prod/companyFunc/page/" + (event.path.substr(event.path.lastIndexOf("/")+1)-1<=0 ? 0 : event.path.substr(event.path.lastIndexOf("/")+1)-1);
                      rows[r]["nextPage"] = "https://0j1j9o13l2.execute-api.us-east-1.amazonaws.com/prod/companyFunc/page/" + (Number(event.path.substr(event.path.lastIndexOf("/")+1))+1>=0+Number(rows[r].totalPages) ? rows[r].totalPages : event.path.substr(event.path.lastIndexOf("/")+1)-0+1);
                    }
                    console.log(rows);
                    my_rows = rows;
                    if (!error) {
                        connection.end();
                        resolve(1);
                    }

                });
            });
            firstpormmmPage.then(function() {
                console.log(my_rows);
                callback(null, {
                    statusCode: '200',
                    // body: err ? err.message : JSON.stringify(res),
                    body: JSON.stringify(my_rows),
                    headers: {
                        'Content-Type': 'application/json',
                        'etag': etag(JSON.stringify(my_rows))             // Even though this is GET but eTag will be different for paginated calls - Front End to handle this?
                    }
                })
            });
            } else if(event.path.includes('/companyFunc/')){ // this is for /companyFunc/:id
              console.log("IN getting company ID");
              console.log(event.path.substr(event.path.lastIndexOf("/") + 1))
              var my_rows;
              let firstpormmmPage = new Promise(function(resolve, reject) {
                  connection.query("SELECT * from company WHERE id=?", event.path.substr(event.path.lastIndexOf("/") + 1),  function (error, rows) {
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
            }

            break;
        case 'POST':
            console.log("IN POST");
            snsPublish('IN companyFunc: POST', {arn: 'arn:aws:sns:us-east-1:099711494433:LambdaTest'});
            var my_rows;
            let postCompanyPromise = new Promise(function(resolve, reject) {

            var compData = JSON.parse(event.body);
                console.log(compData.name);
              connection.query("INSERT INTO company (name, address, type, contactName, phone, fax) VALUES (?, ?, ?, ?, ?, ?)", [compData.name, compData.address, compData.type, compData.contactName, compData.phone, compData.fax], function (error, rows) {
                  console.log(error);
                  console.log(rows);
                  my_rows = rows;
                  connection.query("INSERT INTO idem (`key`, resp) VALUES (?, ?)", [event.headers['idem-key'], JSON.stringify(my_rows)], function (error2, rows2) {
                    if (!error2) {
                        console.log("in error block")
                        console.log(error2)
                        console.log(rows2)
                        connection.end();
                        resolve(1);
                    }
                    console.log("outside of error block")
                    console.log(error2)
                    console.log(rows2)
                  });
                  // if (!error) {
                  //     connection.end();
                  //     resolve(1);
                  //   }
                });
            });
            postCompanyPromise.then(function() {
              console.log(my_rows);
              callback(null, {
                  statusCode: '200',
                  // body: err ? err.message : JSON.stringify(res),
                  body: JSON.stringify(my_rows),
                  headers: {
                      'Content-Type': 'application/json',
                  //    'etag': etag(JSON.stringify(my_rows))
                  }
              })
            });

            break;

        case 'DELETE':
          console.log("In Delete");
          snsPublish('IN companyFunc: DELETE', {arn: 'arn:aws:sns:us-east-1:099711494433:LambdaTest'});
          var my_rows;
          let delelteCompanyPromise = new Promise(function(resolve, reject) {

          var deleteID = JSON.parse(event.body);
            console.log(deleteID.id);
            connection.query("DELETE from company where id=?", deleteID.id , function (error, rows) {
                console.log(error);
                console.log(rows);
                my_rows = rows;
                    connection.query("INSERT INTO idem (`key`, resp) VALUES (?, ?)", [event.headers['idem-key'], JSON.stringify(my_rows)], function (error2, rows2) {
                  if (!error2) {
                      console.log("in error block")
                      console.log(error2)
                      console.log(rows2)
                      connection.end();
                      resolve(1);
                  }
                  console.log("outside of error block")
                  console.log(error2)
                  console.log(rows2)
                });
                // if (!error) {
                //     connection.end();
                //     resolve(1);
                //   }
              });
          });
          delelteCompanyPromise.then(function() {
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
         snsPublish('IN companyFunc: PUT', {arn: 'arn:aws:sns:us-east-1:099711494433:LambdaTest'});
            var my_rows;
            let putCompanyPromise = new Promise(function(resolve, reject) {

            var compData = JSON.parse(event.body);
                console.log(compData.name);
              connection.query("UPDATE company SET name=?, address=?, type=?, contactName=?, phone=?, fax=? WHERE id=?", [compData.name, compData.address, compData.type, compData.contactName, compData.phone, compData.fax, event.path.substr(event.path.lastIndexOf("/") + 1)], function (error, rows) {
                  console.log(error);
                  console.log(rows);
                  my_rows = rows;
                  connection.query("INSERT INTO idem (`key`, resp) VALUES (?, ?)", [event.headers['idem-key'], JSON.stringify(my_rows)], function (error2, rows2) {
                  if (!error2) {
                      console.log("in error block")
                      console.log(error2)
                      console.log(rows2)
                      connection.end();
                      resolve(1);
                  }
                  console.log("outside of error block")
                  console.log(error2)
                  console.log(rows2)
                });
                  // if (!error) {
                  //     connection.end();
                  //     resolve(1);
                  //   }
                });
            });
            putCompanyPromise.then(function() {
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
        default:
            console.log("IN DEFAULT");
            console.log("HTTP Method-"+event.httpMethod);
            done(new Error(`Unsupported method "${event.httpMethod}"`));
    }
  }
  });
  });
};
