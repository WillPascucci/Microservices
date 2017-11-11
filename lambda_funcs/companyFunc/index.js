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

    // Smarty Street back end check - to be integrated when we get the company address from address ID.
    var smartyAuthId = '72315ecb-e04b-4417-200a-bfcb2ac9df63';
    var smartyAuthToken = 'J3njx4aHnVdnf6k7l4yR';
    var host = 'us-street.api.smartystreets.com';

    var SmartyStreets = require('smartystreets-api');
    var smartyStreets = SmartyStreets(smartyAuthId, smartyAuthToken, host);

    var address = '440 Park Ave S, New York, NY, United States';
    console.log("Testing Smarty Streets for - " + address);
    smartyStreets.address(address, function (err, data, raw) {
      console.log("In smarty");
      if (err){
         console.error(err);
      }
      console.log(data);
    });
    
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
          if(event.path == '/companyFunc'){
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

                });
            });
            getCompanyPromise.then(function() {
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
          } else if(event.path.includes('/companyFunc/page/')){
            console.log("IN PAGE");
            console.log(event.path.substr(event.path.lastIndexOf("/") + 1))
            var my_rows;
            let firstpormmmPage = new Promise(function(resolve, reject) {
                connection.query("SELECT ROUND(a.totalPages/5,0) as totalPages, company.* from (select count(*) as totalPages from company) as a, company LIMIT "+(event.path.substr(event.path.lastIndexOf("/") + 1)*5)+", 5",  function (error, rows) {
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
            snsPublish('IN companyFunc: POST', {arn: 'arn:aws:sns:us-east-1:099711494433:LambdaTest'});
            var my_rows;
            let postCompanyPromise = new Promise(function(resolve, reject) {

            var compData = JSON.parse(event.body);
                console.log(compData.name);
              connection.query("INSERT INTO company (name, address, type, contactName, phone, fax) VALUES (?, ?, ?, ?, ?, ?)", [compData.name, compData.address, compData.type, compData.contactName, compData.phone, compData.fax], function (error, rows) {
                  console.log(error);
                  console.log(rows);
                  my_rows = rows;
                  if (!error) {
                      connection.end();
                      resolve(1);
                    }
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
                if (!error) {
                    connection.end();
                    resolve(1);
                  }
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
            console.log("HTTP Method-"+event.httpMethod);
            done(new Error(`Unsupported method "${event.httpMethod}"`));
    }
});
};
