"use strict";

let mongoose = require("mongoose"),
    inherits = require('util').inherits,
    EventEmitter = require('events').EventEmitter;

module.exports = MongooseConnection;

function MongooseConnection(databasesConfig, autoConnect) {
    if (!(this instanceof MongooseConnection))
        return new MongooseConnection(databasesConfig, autoConnect);

    // we attach this vars to the object to access them from outside the module
    this.databases = {};
    this.dbConfigs = {};
    this.uris = [];

    let conf = databasesConfig;
    conf.forEach((dbConf, i) => {
        var hostURI = dbConf.host;
        if (hostURI.slice(-1) === "/")
            hostURI = dbConf.host.slice(0, -1);
        let uri = "mongodb://" + hostURI + "/" + dbConf.collection;
        uri += dbConf.options ? "?" + dbConf.options : "";
        this.uris.push(uri);
        dbConf.uri = uri;

        let name = "db" + dbConf.collection[0].toUpperCase() + dbConf.collection.substr(1);
        this.dbConfigs[name] = dbConf;
    });

    // attach properties from MongoDBConnection to the EventEmitter instance
    EventEmitter.call(this);

    if (autoConnect)
        this.connect();
}

// we need to inherit from EventEmitter to be able to emit events
// this allows consumers of this module to listen events very simple
// i.e. require('@vloom/api-utils').MongooseConnection.on("open", handler)
inherits(MongooseConnection, EventEmitter);

MongooseConnection.prototype.connect = function () {
    var self = this;

    var dbNames = Object.keys(self.dbConfigs),
        dbsTotal = dbNames.length;

    // Connect to each database
    for (var i = 0; i < dbsTotal; i++) {
        (function auxfunct(i, dbName, dbs, dbConfs) {
            var db = mongoose.createConnection(dbConfs[dbName].uri);
            dbs[dbName] = db;
            dbConfs[dbName].database = db;
            // If the connection throws an error
            db.on("error", function (err) {
                self.emit("error", err);
            });

            // When the connection is disconnected
            db.on("disconnected", function () {
                self.emit("disconnected");
            });

            db.on("open", function () {
                self.emit("connected", db);
            });
        })(i, dbNames[i], self.databases, self.dbConfigs);
    }
    // If the Node process ends, close the Mongoose connection
    //process.on("SIGINT", gracefulExit).on("SIGTERM", gracefulExit);
}
