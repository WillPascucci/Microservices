var express = require('express')
var app = express()

var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : "aa18rny5pdr87g5.cyi40ipdvtjm.us-east-1.rds.amazonaws.com",
  user     : "microservices",
  password : "microservices",
  port     : 3306,
  database : "microservices"
});

connection.connect(function(err) {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    connection.end();
    return;
  }

  console.log('You are connected');


  app.get('/', function (req, res) {
    res.send('Hello World - running on Express!')
  })

  app.get('/person', function (req, res) {
    connection.query("SELECT * from Person", function (err, rows) {
      res.json(rows);
    })
  });

  app.post('/person', function (req, res) {
    //Need to test this out, postman or something?
    connection.query("INSERT INTO Person VALUES (?, ?, ?, ?)", req.params.first, req.params.last, req.params.age, req.params.phone, function (err, rows) {
      res.send('Post call on the Person!');
    })
  });

  app.get('/person/:id', function(req, res) {
    connection.query("SELECT * from Person WHERE id=?", req.params.id, function (err, rows) {
      if (rows[0]) {
        res.json(rows[0]);
      } else {
        res.send("Invalid id!");
      }
    })
  });

  app.put('/person/:id', function(req, res) {
    res.send('Put on Person - ' + req.params.id);
  });

  app.delete('/person/:id', function(req, res) {
    res.send('Delete on Person - ' + req.params.id);
  });

  app.listen(8000, function () {
    console.log('Person app listening on port 8000!');
  });


});