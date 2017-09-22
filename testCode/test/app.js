var express = require('express'),
	    http = require('http');

var app = express();

app.set('port', process.env.PORT || 3000);

app.get('/test', function(req, res) {
	  res.json({'message':'hi'});
});

app.get('/Person', function(req, res) {
	  res.json([{'firstName':'Will', 'lastName': 'Pascucci'},
	  			{'firstName':'Yuval', 'lastName': 'Schaal'},
	  			{'firstName':'Apoorv', 'lastName': 'Purwar'}]);
});


http.createServer(app).listen(app.get('port'), function() {
	  console.log("Cloudbackend listening on port " + app.get('port'));
});
