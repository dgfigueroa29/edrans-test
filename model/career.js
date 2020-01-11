'use strict';

const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const Career = new Schema({
    id: {type: String},
    name: {type: Date},
    title: {type: String},
    subjects: {type: Array}
});

module.exports = mongoose.model('Career', Career);