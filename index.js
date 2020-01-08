'use strict';
const express = require('express'),
    Log = require('log'),
    log = new Log(),
    app = express(),
    router = express.Router(),
    jsonParser = require('body-parser').json({limit: '50mb', defer: true}),
    util = require('util'),
    config = require('./config'),
    mongoose = require('mongoose'),
    prefix = '/api/v' + config.app.version + '/',
    port = process.env.PORT || config.app.port;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://' + config.database.host, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        require('./router')(router);

        app.use(jsonParser);
        app.all('*', function (req, res, next) {
            res.header('Access-Control-Allow-Origin', req.headers.origin);
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            next();
        });

        app.use(prefix, router);

        //Error handling:
        const errorHandler = (err, req, res) => {
            console.log(err);
            log.info('Handler: ' + util.inspect(err, {showHidden: true, compact: true, depth: 5, breakLength: 80}));
            res.status(500).send({
                error: util.inspect(err, {
                    showHidden: true,
                    compact: true,
                    depth: 5,
                    breakLength: 80
                })
            });
        };

        app.use(errorHandler);

        //Start the server:
        app.listen(port);
        log.info('API::' + port);
    })
    .catch(err => {
        console.log(err);
        log.info('Catch: ' + util.inspect(err, {showHidden: true, compact: true, depth: 5, breakLength: 80}));
    });
