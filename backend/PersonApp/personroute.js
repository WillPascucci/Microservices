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
  res.send('Get call on the Person!');
  console.log('First Name in Query-' + req.query.firstName);
  console.log('Last Name in Query-' + req.query.lastName);
  console.log('Last Name in Query-' + req.query.pageNum);

 /* //Dummy MySQL Query -
  connection.query('SELECT * from Person', function (err, rows, fields) {
    if (err) throw err
    console.log('The solution is: ', rows[0].solution)
  })*/
})

app.post('/person', function (req, res) {
  res.send('Post call on the Person!');
});

app.get('/person/:id', function(req, res) {
    connection.query("SELECT * from Person WHERE id=10", function (err, rows) {
    res.send(rows[0].firstname + " aaa " + err + " bbb " + req.params.id);

})});

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