var port = process.env.PORT || 3000,
    http = require('http'),
    fs = require('fs'),
    html = fs.readFileSync('index.html');

var log = function(entry) {
    fs.appendFileSync('/tmp/sample-app.log', new Date().toISOString() + ' - ' + entry + '\n');
};

var server = http.createServer(function (req, res) {
    if (req.method === 'POST') {
        var body = '';

        req.on('data', function(chunk) {
            body += chunk;
        });

        req.on('end', function() {
            if (req.url === '/') {
                log('Received message: ' + body);
            } else if (req.url = '/scheduled') {
                log('Received task ' + req.headers['x-aws-sqsd-taskname'] + ' scheduled at ' + req.headers['x-aws-sqsd-scheduled-at']);
            }

            res.writeHead(200, 'OK', {'Content-Type': 'text/plain'});
            res.end();
        });
    } else {
        res.writeHead(200);
        res.write(html);
        res.end();
    }
});

// Listen on port 3000, IP defaults to 127.0.0.1
server.listen(port);

// Put a friendly message on the terminal
console.log('Server running at http://127.0.0.1:' + port + '/');

var mysql = require('mysql');
var Sequelize = require('sequelize');

var sequelize = new Sequelize('microservices', process.env.RDS_USERNAME, process.env.RDS_PASSWORD, {
  host: process.env.RDS_HOSTNAME,
  port: process.env.RDS_PORT,
  dialect: 'mysql'
});

sequelize.authenticate()
  .then(function(err) {
    console.log('Connection has been established successfully.');
  })
  .catch(function (err) {
    console.log('Unable to connect to the database:', err);
  });

const address = sequelize.define("Address", {
  uuid: Sequelize.UUID,
  street: Sequelize.TEXT,
  city: Sequelize.TEXT,
  state: Sequelize.TEXT('tiny'),
  zipcode: Sequelize.TEXT
})

sequelize.query("SELECT * FROM Address", {model: address})
  .then(results => {
    console.log(results[0])
    console.log(results[0].uuid)
    console.log(results[0].street)
    console.log(results[0].city)
    console.log(results[0].state)
    console.log(results[0].zipcode)
  })