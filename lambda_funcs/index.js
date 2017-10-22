'use strict';

console.log('Loading function');
// var express = require('express');
// var bodyParser = require('body-parser');
// var app = express();
var mysql = require('mysql');
var request = require('request');


var connection = mysql.createConnection({
  host     : "assignmentpart2db.cyi40ipdvtjm.us-east-1.rds.amazonaws.com",
  user     : "microservices",
  password : "microservices",
  port     : 3306,
  database : "microservices"
});


exports.handler = (event, context, callback) => {
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


    const done = (err, res) => callback(null, {
        statusCode: err ? '400' : '200',
        body: err ? err.message : JSON.stringify(res),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    switch (event.httpMethod) {
        case 'GET':
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
            // connection.query("SELECT * from company", function (error, rows) {
            //     console.log(error);
            //     console.log(rows);
            //     if (error) {
            //         console.log("IN ERROR");
            //         callback(error, null);
            //     } else {
            //         console.log("IN ELSE");
            //         clalback(null, {
            //             statusCode: error ? '400' : '200',
            //             // body: err ? err.message : JSON.stringify(res),
            //             body: error ? error.message : rows[0].id,
            //             headers: {
            //                 'Content-Type': 'application/json',
            //             }
            //         });
            //         console.log("AT END");
            //         connection.end();
            //     }
            // });
            break;
        case 'POST':
            console.log("IN POST");
            var my_rows;
            let postCompanyPromise = new Promise(function(resolve, reject) {
              console.log("See This ---");
            //  console.log(event.body["name"]);
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

            // connection.query("INSERT INTO company (name, address, type, contactName, phone, fax) VALUES (?, ?, ?, ?, ?, ?)", [event.body.name, event.body.address, event.body.type, event.body.contactName, event.body.phone, event.body.fax], function (error, rows) {
            //     console.log(error);
            //     console.log(rows);
            //     callback(null, {
            //         statusCode: error ? '400' : '200',
            //         // body: err ? err.message : JSON.stringify(res),
            //         body: JSON.stringify("Success!"),
            //         headers: {
            //             'Content-Type': 'application/json',
            //         }
            //     });
            // });
            break;
        default:
            console.log("IN DEFAULT");
            console.log("HTTP Method-"+event.httpMethod);
          //  done(new Error(`Unsupported method "${event.httpMethod}"`));
    }
});
};
