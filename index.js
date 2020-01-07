"use strict";
const express = require("express"),
    Log = require("log"),
    log = new Log(),
    app = express(),
    router = express.Router(),
    jsonParser = require("body-parser").json({limit: "50mb", defer: true}),
    util = require("util"),
    config = require('./config'),
    mongoose = require("mongoose"),
    prefix = "/api/v" + config.app.version + "/",
    port = process.env.PORT || config.app.port,
    dbConn = require("./db/mongoose")(config.databases, true);

mongoose.Promise = global.Promise;

dbConn.once("connected", function (database) {
    require("./router")(router, dbConn);

    app.use(jsonParser);
    app.all("*", function (req, res, next) {
        res.header("Access-Control-Allow-Origin", req.headers.origin);
        res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
        next();
    });

    app.use(prefix, router);

    //Error handling:
    function errorHandler(err, req, res) {
        log.info("Handler: " + util.inspect(err, {showHidden: true, compact: true, depth: 5, breakLength: 80}));
        res.status(500).send({error: util.inspect(err, {showHidden: true, compact: true, depth: 5, breakLength: 80})});
    }

    app.use(errorHandler);

    //Start the server:
    app.listen(port);
    log.info("API:: " + port);
});
