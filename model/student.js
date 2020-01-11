'use strict';

const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const Student = new Schema({
    id: {type: String},
    birthday: {type: Date},
    address: {type: String},
    careers: {type: Array}
});

module.exports = mongoose.model('Student', Student);