'use strict';
const express = require('express'),
    app = express(),
    router = express.Router(),
    bodyParser = require('body-parser'),
    util = require('util'),
    config = require('./config'),
    mongoose = require('mongoose'),
    prefix = '/api/v' + config.app.version + '/',
    port = process.env.PORT || config.app.port;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://' + config.database.host, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        require('./router')(router);

        app.use(bodyParser.urlencoded({extended: false}));
        app.use(bodyParser.json());
        app.all('*', function (req, res, next) {
            res.header('Access-Control-Allow-Origin', req.headers.origin);
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            next();
        });

        app.use(prefix, router);
        app.use((error, req, res, next) => {
            console.log('Handler Message: ' + error.stack);
            res.status(500).send({'error': error.stack});
        });
        app.listen(port);
        console.log('http://edrans-test.test::' + port + prefix);
    })
    .catch(error => {
        console.log('Catch: ' + util.inspect(error, {showHidden: true, compact: true, depth: 1, breakLength: 20}));
    });
