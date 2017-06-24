var express = require('express');
var routerList = function(noteCollection, mongo){
    var router = express.Router();
    // Endpoint : GET
    router.get('/', function(req, res){
        this.noteCollection.find().toArray(function (err, docs){
            res.status(200).json(docs);
        });
    });

    // Endpoint : GET/:id
    router.get("/:id", function(req, res){
        var docId = new mongo.ObjectID(req.params.id);
        this.noteCollection.find({
            "_id" : docId
        }).toArray(function (err, docs){
            res.status(200).json(docs);
        });
    });

    // Endpoint : POST
    router.post('/', function(req, res ){
        req.assert('judul_note', 'isi_note belum terdefinisi').notEmpty();
        req.assert('isi_note', 'isi_note belum terdefinisi').notEmpty();
        var validationErrors = req.validationErrors();
        if(!validationErrors){
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
        } else {
            res.status(400).send(validationErrors);           
        }
    });

    // Endpoint : PUT
    router.put('/:id', function(req, res){
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
    router.delete('/:id', function(req, res){
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

    return router;
};
module.exports = routerList;