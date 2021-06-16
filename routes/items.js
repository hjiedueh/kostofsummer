const express = require('express');
const bodyParser = require('body-parser');
const Item = require('../models/item')
const cors = require('./cors');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'picture') {
            cb(null, 'public/images')
        } else {
            console.log(file.mimetype)
            cb({error: 'Mime type not supported'})
        }
    },

    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});

const upload = multer({storage: storage})

const itemRouter = express.Router()

itemRouter.use(bodyParser.json());

itemRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req, res, next) => {
    Item.find(req.query)
    .then((items) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(items)
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, upload.single('picture'), (req, res, next) => {
    if (!req.file) {
        return res.status(500).send({ msg: "file is not found" })
    }
    const item = req.body;
    item.picture = 'images/' + req.file.filename
    Item.create(item)
    .then((item) => {
        Item.findById(item.id)
        .then((item) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(item);
        })
    })
    .catch((err) => next(err))
})
.put(cors.corsWithOptions, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /item');
})
.delete(cors.corsWithOptions,   (req, res, next) => {
    Item.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

itemRouter.route('/:itemId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
    Item.findById(req.params.itemId)
    .then((item) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(item);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions,   (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /item/:itemID'+ req.params.itemId);
})
.put(cors.corsWithOptions,   (req, res, next) => {
    Item.findByIdAndUpdate(req.params.itemId, {
        $set: req.body
    }, { new: true })
    .then((item) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(item);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions,   (req, res, next) => {
    Item.findByIdAndRemove(req.params.itemId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = itemRouter;