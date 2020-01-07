"use strict";
const nodeEnv = process.env.NODE_ENV || "dev",
    config = {
        dev: require("./dev")
    };

module.exports = config[nodeEnv];