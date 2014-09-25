'use strict';

var newrelic   = require('newrelic'),
    http       = require('http'),
    express    = require('express'),
    bodyParser = require('body-parser'),
    path       = require('path'),
    fs 	       = require('fs'),
    morgan     = require('morgan'),
    RED        = require('node-red');

// Create an Express app
var app = express();

app.set('port', process.env.PORT || 3000);

// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(__dirname + '/access.log', {flags: 'a'});

// setup the logger
app.use(morgan('combined', {stream: accessLogStream}));
//app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Force HTTPS
//if (app.get('env') === 'production') {
//  app.use(function(req, res, next) {
//    var protocol = req.get('x-forwarded-proto');
//    protocol == 'https' ? next() : res.redirect('https://' + req.hostname + req.url);
//  });
//}

//app.use(express.static(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

require('./routes.js')(app);

// Create a server
var server = http.createServer(app);

// Create the settings object
var settings = {
  httpAdminRoot: "/red",
  httpNodeRoot: "/api",
  httpStatic: '/',
  userDir: __dirname+'/user',
  nodesDir: __dirname+'/nodes',
  flowFile: 'flows.json',
  verbose: true,
  functionGlobalContext: {
    startup:Date.now()
  }
};

// Initialise the runtime with a server and settings
RED.init(server, settings);

// Serve the editor UI from /red
app.use(settings.httpAdminRoot, RED.httpAdmin);

// Serve the http nodes UI from /api
app.use(settings.httpNodeRoot, RED.httpNode);

//server.listen(app.get('port'), function() {
app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});


// Start the runtime
RED.start();