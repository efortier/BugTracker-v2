'use strict';

var express = require("express");
var path = require("path");
var cors = require('cors');
var parser = require('body-parser');
//var passport = require('passport');
//var LocalStrategy = require('passport-local').Strategy;
var jwt = require('jsonwebtoken');
var configs = require('./configs.misc');

// disable logging in production.
// if (process.env.production || configs.noLogging) {
//     console.log = function() {};
// }

console.log('Starting BugTracker v2')

// connect to the database.
const mongoose = require('mongoose');
mongoose.connect(configs.databaseConnectString);
mongoose.connection.on('connected', () => {
    console.log('Connected to database');
});
mongoose.connection.on('error', (err) => {
    console.log('Error connecting to database' + err);
});

// initialize app.
var app = express();
app.set('superSecret', configs.tokenSecret);

// we'll use CORS.
app.use(cors());

// Setup View Engines
app.set("views", path.join(__dirname, "app/views"));

app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

// Serve files from your "public" directory
app.use(express.static(path.join(__dirname + "/public")));

// the body parser.
app.use(parser.urlencoded({ extended: false }));
app.use(parser.json());

// passport. 
// app.use(passport.initialize());
// //app.use(passport.session());
// require('./config.passport')(passport);

// log stuff.
// if(!process.env.production)
// {
// 	var morgan = require('morgan');
// 	app.use(morgan('dev'));
// }

// some static paths.
app.use("/bower_components", express.static(path.join(__dirname + "/bower_components")));
app.use("/app", express.static(path.join(__dirname + "/app")));

// some routes.
app.use('/users', require('./routes.users'));
app.use('/issues', require('./routes.issues'));

// //GET index.html route
app.use("/*", function(req, res) {
  return res.render(path.join(__dirname, 'public/index.html'));
});

// catch all.

// app.get('/', (req, res) => {
//   res.send('Invalid Endpoint');
// });

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public/index.html'));
// });

// app.get('*', (req,res)=>{
//   res.sendFile(path.join(__dirname, 'public/index.html'));
// });

module.exports = app;

// Start our server and start to listen
var port = configs.port;
app.listen(port, function() {
  console.log("Listening to port " + port);
});
