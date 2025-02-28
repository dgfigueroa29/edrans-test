'use strict';

const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const Subject = new Schema({
    id: {type: String},
    name: {type: String},
    workload: {type: Number, min: 0, default: 0},
    status: {type: Number, min: 0, default: 0},
    score: {type: Number, min: 0, max: 100, default: 0},
    registered: {type: Boolean, default: false}
});

module.exports = mongoose.model('Subject', Subject);