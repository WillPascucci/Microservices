'use strict';

console.log('Loading function');
var request = require('request');
var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://neo4j:zzzzz@34.239.129.68:7474');


console.log("IN START");

exports.handler = (event, context, callback) => {


    // return;

    const done = (err, res) => callback(null, {
        statusCode: err ? '400' : '200',
        body: err ? err.message : JSON.stringify(res),
        headers: {
            'Content-Type': 'application/json',
        },
    });


    switch (event.httpMethod) {
        case 'GET':
            if(event.path == '/playerFunc'){
                console.log("IN GET");
                var my_rows;
                // let secondpormm = new Promise(function(resolve, reject) {
                // });


                db.cypher({
                    query: 'match (n:Player) return n',
                }, function (err, results) {
                    if (err) throw err;
                    var result = results[0];
                    if (!result) {
                        console.log('No user found.');
                    } else {
                        console.log(results)
                        console.log("BETWEEN")
                        // var user = result['u'];
                        console.log(JSON.stringify(results));
                        callback(null, {
                            statusCode: '200',
                            body: JSON.stringify(results),
                            headers: {
                                'Content-Type': 'application/json',
                            }
                        })
                    }
                });



            } else if(event.path.includes('/playerFunc/')){ // this is for /companyFunc/:id

              console.log(event.path.substr(event.path.lastIndexOf("/") + 1))
              var id = event.path.substr(event.path.lastIndexOf("/") + 1)
              console.log(id)
                db.cypher({
                    query: 'match (n:Player {player_id: ' + "'" + id + "'" + '}) return n',
                    // query: 'match (n:Player {player_id: $id }) return n',
                }, function (err, results) {
                    if (err) throw err;
                    var result = results[0];
                    if (!result) {
                        console.log('No user found.');
                    } else {
                        console.log(result)
                        console.log("BETWEEN")
                        // var user = result['u'];
                        console.log(JSON.stringify(result));
                        callback(null, {
                            statusCode: '200',
                            body: JSON.stringify(result),
                            headers: {
                                'Content-Type': 'application/json',
                            }
                        })
                    }
                });

            }
            break;
        case 'POST':
            console.log("IN POST");
            var bod = JSON.parse(event.body);
            console.log(bod)
            console.log(event.body)
            console.log(JSON.stringify(event.body))
            console.log(JSON.stringify(bod))


              db.cypher({
                  query: 'CREATE (n:Player { birthCountry : ' + "'" + bod['birthCountry'] + "'," + 'last_name : ' + "'" + bod['last_name'] + "'," + 'player_id : ' + "'" + bod['player_id'] + "'," + 'birthYear : ' + "'" + bod['birthYear'] + "'," + 'first_name : ' + "'" + bod['first_name'] + "'" + '}) RETURN n',


                  // ', last_name: {last_name}, player_id: {player_id}, birthYear: {birthYear}, first_name: {first_name} }) RETURN n',
                  // params: bod
              }, function (err, results) {
                  if (err) throw err;
                  var result = results[0];
                  if (!result) {
                      console.log('No user found.');
                  } else {
                      console.log(result)
                      console.log("BETWEEN")
                      // var user = result['u'];
                      console.log(JSON.stringify(result));
                      callback(null, {
                          statusCode: '200',
                          body: JSON.stringify(result),
                          headers: {
                              'Content-Type': 'application/json',
                          }
                      })
                  }
              });


            break;
        case 'DELETE':
            console.log("IN DELETE");
            console.log(event.path.substr(event.path.lastIndexOf("/") + 1))
            var id = event.path.substr(event.path.lastIndexOf("/") + 1)
            console.log(id)
              db.cypher({
                  query: 'match (n:Player {player_id: ' + "'" + id + "'" + '}) delete n',
                  // query: 'match (n:Player {player_id: $id }) return n',
              }, function (err, results) {
                  if (err) throw err;
                  // var result = results[0];
                  console.log(results)
                  console.log("BETWEEN")
                  // var user = result['u'];
                  console.log(JSON.stringify(results));
                  callback(null, {
                      statusCode: '200',
                      body: JSON.stringify(results),
                      headers: {
                          'Content-Type': 'application/json',
                      }
                  })
              });
            break;
        case 'PUT': // this is for PUT on companyFunc/:id
         console.log("IN PUT");
            snsPublish('In employeeFunc: PUT', {arn: 'arn:aws:sns:us-east-1:099711494433:LambdaTest'});
            var my_rows;
            let putEmployeePromise = new Promise(function(resolve, reject) {
            var bod = JSON.parse(event.body);
            connection.query("UPDATE employee SET personId=?, companyId=?, salary=?, title=? WHERE employeeId=?", [bod.personId, bod.companyId, bod.salary, bod.title, event.path.substr(event.path.lastIndexOf("/") + 1)], function (error, rows) {
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
            putEmployeePromise.then(function() {
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
            done(new Error(`Unsupported method "${event.httpMethod}"`));
    }
  };
