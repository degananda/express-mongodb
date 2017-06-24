var express = require('express');
var app = express();
var expressValidator = require('express-validator');
var bodyParser = require('body-parser');
var appPort = process.env.port || 7250;

// http auth (basic)
var auth = require('http-auth');
var basic = auth.basic({
        realm: "Who are you?"
    }, (username, password, callback) => { 
        callback(username === "degananda" && password === "indonesiaraya");
    }
);
// Implementasi basic auth pada express
app.use(auth.connect(basic));

// Gunakan body parser dan menerima json
// agar kita dapat menggunakan req.body (untuk mengambil http request body yang diberikan oleh client/user)
app.use(bodyParser.json());

// menggunakan express validator
app.use(expressValidator());

// Konfigurasi mongodb
var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;

// Connection URL
var url = 'mongodb://localhost:27017/degananda'; // degananda adalah nama database.
var dbConnect;
var noteCollection;
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
    this.dbConnect = db;
    this.noteCollection = this.dbConnect.collection('note');
    console.log("Connected correctly to server");
});

// import routerModule
var noteRouter = require('./routeModule/note.js')(noteCollection, mongo);

// use routerModule
app.use('/note', noteRouter);

app.listen(appPort , function(){
    console.log('apps running on : ' + appPort);
});