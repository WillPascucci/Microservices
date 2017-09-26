var express = require('express')
var app = express()

var mysql = require('mysql');
var bodyParser = require('body-parser');
var request = require('request');
var connection = mysql.createConnection({
  host     : "aagm9e2du3rm1z.cyi40ipdvtjm.us-east-1.rds.amazonaws.com",
  user     : "microservices",
  password : "microservices",
  port     : 3306,
  database : "microservices"
});

app.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
	console.log('here');
	next();
 });

app.use(bodyParser());

connection.connect(function(err) {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    connection.end();
    return;
  }

  console.log('You are connected to Address App');


  app.get('/', function (req, res) {
    res.send('Hello World - running on Express!')
  })

  app.get('/address', function (req, res) {
    connection.query("SELECT * from Address", function (err, rows) {
      for (row in rows){
        if(row){
          rows[row].self={
               href: 'http://Address-env.uitihrdzi7.us-east-1.elasticbeanstalk.com:8000/address/' + rows[row]['uuid']
        }
      }
    }
      res.json(rows);
    })
  });

  app.post('/address', function (req, res) {
    //Need to test this out, postman or something?
    connection.query("INSERT INTO Address VALUES (?, ?, ?, ?)", req.params.street, req.params.city, req.params.state, req.params.zipcode, function (err, rows) {
      res.send('Post call on the Address!');
    })
  });

  app.get('/address/page/:offset', function (req, res) {
    connection.query("SELECT ROUND(a.totalPages/5,0) as totalPages, Address.* from (select count(*) as totalPages from Address) as a, Address LIMIT "+(req.params.offset*5)+", 5",  function (err, rows) {
      request('http://person-env.n924wyqpyp.us-east-1.elasticbeanstalk.com:8000/person', function (error, response, body) {
        if (response.statusCode === 200) {
        console.log(body)
        body = JSON.parse(body);
        for (row in rows) {
          for (person in body) {
            if (body[person].addressUuid == rows[row].uuid) {
              console.log(person);
              rows[row]["person"] = body[person].firstname + ", " + body[person].lastname;
              delete rows[row]["uuid"];
            }
          }
        }
          console.log(rows)
          res.json(rows);
        }
        });
    })
  });

  app.get('/address/:id', function(req, res) {
    connection.query("SELECT * from Address WHERE uuid=?", req.params.id, function (err, rows) {
      if (err) {
        console.error('Failed to fetch address: ' + err.stack);
      }else{
      if (rows[0]) {
          rows[0].self={
               href: 'http://Address-env.uitihrdzi7.us-east-1.elasticbeanstalk.com:8000/address/' + rows[0]['uuid']
             }
        res.json(rows[0]);
      } else {
        res.send("Invalid id!");
      }
    }
    })
  });

 app.put('/address/:id', function(req, res) {
   console.log(req);
   connection.query("UPDATE Address SET street=?, city=?, state=?, zipcode=?", [req.body.street, req.body.city, req.body.state, req.body.zipcode], function (err, rows) {
   res.send('Put on Person - ' + req.params.id);
   })
  });

  app.delete('/address/:id', function(req, res) {
    //Need to test this out, postman or something?
    connection.query("DELETE FROM Address WHERE uuid=?", req.params.id, function (err, rows) {
      res.send('Delete on Address - ' + req.params.id);
    })
  });


  app.get('/address/:id/persons', function(req, res) {
    //Change port back - when checing in to 8000 and the port Person App is listening to
    console.log('http://person-env.n924wyqpyp.us-east-1.elasticbeanstalk.com:8000/person/address/'+req.params.id);
    request('http://person-env.n924wyqpyp.us-east-1.elasticbeanstalk.com:8000/person/address/'+req.params.id, function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    console.log('body:', body); // Print the HTML for the Google homepage.
    res.json(JSON.parse(body));

  })
  });

  app.listen(8000, function () {
    console.log('Address app listening on port 8000!');
  });


});
