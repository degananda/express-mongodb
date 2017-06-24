var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var appPort = process.env.port || 7250;

// Gunakan body parser dan menerima json
// agar kita dapat menggunakan req.body (untuk mengambil http request body yang diberikan oleh client/user)
app.use(bodyParser.json());

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

// Endpoint : GET
app.get('/note', function(req, res){
    this.noteCollection.find().toArray(function (err, docs){
        res.status(200).json(docs);
    });
});

// Endpoint : GET/:id
app.get("/note/:id", function(req, res){
    var docId = new mongo.ObjectID(req.params.id);
    this.noteCollection.find({
        "_id" : docId
    }).toArray(function (err, docs){
        res.status(200).json(docs);
    });
});

// Endpoint : POST
app.post('/note', function(req, res ){
    this.noteCollection.insert({
        "judul_note" : req.body.judul_note,
        "isi_note" : req.body.isi_note,
        "date_posted" : new Date().getTime()
    }, function(err, result){
        if(!err){
            res.status(200).send('berhasil menambahkan note');
        } else {
            throw err;
        }
    });

});

// Endpoint : PUT
app.put('/note/:id', function(req, res){
    var docId = new mongo.ObjectID(req.params.id);
    this.noteCollection.update({
        "_id" : docId
    }, {
        "judul_note" : req.body.judul_note,
        "isi_note" : req.body.isi_note,
        "date_updated" : new Date().getTime()
    }, function(err, result){
        if(!err){
            res.status(200).send('berhasil mengubah note');
        } else {
            throw err;
        }
    });
});

// Endpoint : DELETE
app.delete('/note/:id', function(req, res){
    var docId = new mongo.ObjectID(req.params.id);
    this.noteCollection.remove({
        "_id" : docId
    }, function(err, result){
        if(!err){
            res.status(200).send('berhasil menghapus note');
        } else {
            throw err;
        }
    });
});


app.listen(appPort , function(){
    console.log('apps running on : ' + appPort);
});