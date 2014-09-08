'use strict';

require('newrelic');
var http       = require('http');
var express    = require('express');
var fs 	       = require('fs');
var morgan     = require('morgan');
var RED        = require('node-red');

// Create an Express app
var app = express();

// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(__dirname + '/access.log', {flags: 'a'});

// setup the logger
app.use(morgan('combined', {stream: accessLogStream}));

// Add a simple route for static content served from 'public'
app.use(express.static(__dirname + '/public'));

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

server.listen(process.env.PORT || 3000);

// Start the runtime
RED.start();
