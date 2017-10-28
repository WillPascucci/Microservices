'use strict';

console.log('Loading function');
// var express = require('express');
// var bodyParser = require('body-parser');
// var app = express();
var mysql = require('mysql');
var request = require('request');
var snsPublish = require('aws-sns-publish');

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


    console.log("HI1");
    console.log(event);
    console.log("HI2");
    console.log(context);
    console.log("HI3");
    console.log(event.httpMethod);
    console.log("HI4");
    console.log(context.httpMethod);
    console.log("HI5");
    
    snsPublish('In customerFunc...', {arn: 'arn:aws:sns:us-east-1:099711494433:LambdaTest'});


    const done = (err, res) => callback(null, {
        statusCode: err ? '400' : '200',
        body: err ? err.message : JSON.stringify(res),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    //event.httpMethod = 'GET'
    console.log(event.body);
    console.log(context);
    console.log("EVENT PATH");
    console.log(event.path);

    switch (event.httpMethod) {
        case 'GET':
            if(event.path == '/customerFunc2'){
                    console.log("IN GET");
                    var my_rows;
                    let firstpormmm = new Promise(function(resolve, reject) {
                        connection.query("SELECT * from customer", function (error, rows) {
                            console.log(error);
                            console.log(rows);
                            my_rows = rows;
                            if (!error) {
                                connection.end();
                                resolve(1);
                            }

                        });
                    });
                    firstpormmm.then(function() {
                        console.log(my_rows);
                        callback(null, {
                            statusCode: '200',
                            // body: err ? err.message : JSON.stringify(res),
                            body: JSON.stringify(my_rows),
                            headers: {
                                'Content-Type': 'application/json',
                            }
                        })
                    });
                    break;
            } else if(event.path.includes('/customerFunc2/page/')){
                    console.log("IN PAGE");
                    console.log(event.path.substr(event.path.lastIndexOf("/") + 1))
                    var my_rows;
                    let firstpormmmPage = new Promise(function(resolve, reject) {
                        connection.query("SELECT ROUND(a.totalPages/5,0) as totalPages, customer.* from (select count(*) as totalPages from customer) as a, customer LIMIT "+(event.path.substr(event.path.lastIndexOf("/") + 1)*5)+", 5",  function (error, rows) {
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
                            statusCode: '200',
                            // body: err ? err.message : JSON.stringify(res),
                            body: JSON.stringify(my_rows),
                            headers: {
                                'Content-Type': 'application/json',
                            }
                        })
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
                  console.log(my_rows);
                  callback(null, {
                      statusCode: '200',
                      // body: err ? err.message : JSON.stringify(res),
                      body: JSON.stringify(my_rows),
                      headers: {
                          'Content-Type': 'application/json',
                      }
                  })
              });
            }
            break;
        case 'POST':
            console.log("IN POST");
            snsPublish('In customerFunc.: POST', {arn: 'arn:aws:sns:us-east-1:099711494433:LambdaTest'});
            connection.query("INSERT INTO customer (name, address, type, contactName, phone, fax) VALUES (?, ?, ?, ?, ?, ?)", [event.body.name, event.body.address, event.body.type, event.body.contactName, event.body.phone, event.body.fax], function (error, rows) {
                console.log(error);
                console.log(rows);
                callback(null, {
                    statusCode: error ? '400' : '200',
                    // body: err ? err.message : JSON.stringify(res),
                    body: JSON.stringify("Success!"),
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
            });
            break;
        case 'DELETE':
            console.log("IN DELETE");
            snsPublish('In customerFunc.: DELETE', {arn: 'arn:aws:sns:us-east-1:099711494433:LambdaTest'});
            console.log(event.body.name);
            let firstpormmm2 = new Promise(function(resolve, reject) {
                connection.query("SELECT * from customer where customerId="+String(event.body.name), function (error, rows) {
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
                    }
                })
            });
            break;
        case 'PUT': // this is for PUT on companyFunc/:id
         console.log("IN PUT");
            snsPublish('In customerFunc.: PUT', {arn: 'arn:aws:sns:us-east-1:099711494433:LambdaTest'});
            var my_rows;
            let putCompanyPromise = new Promise(function(resolve, reject) {

            var compData = JSON.parse(event.body);
                console.log(compData.name);
              connection.query("UPDATE customer SET name=?, address=?, type=?, contactName=?, phone=?, fax=? WHERE customerId=?", [event.body.name, event.body.address, event.body.type, event.body.contactName, event.body.phone, event.body.fax, event.path.substr(event.path.lastIndexOf("/") + 1)], function (error, rows) {
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
                  }
              })
            });
        default:
            console.log("IN DEFAULT");
            console.log(event.httpMethod);
            done(new Error(`Unsupported method "${event.httpMethod}"`));
    }
});
};
