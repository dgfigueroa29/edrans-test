'use strict';
const FasterValidator = require('fastest-validator'),
    validator = new FasterValidator(),
    schema = {
        'name': {type: 'string', min: 2}
    };

const createStudent = (req, res, next) => {
    schema.birthday = {type: 'date'};
    process(req, res, next, schema);
};

const createSubject = (req, res, next) => {
    schema.workload = {type: 'number', positive: true, min: 2};
    process(req, res, next, schema);
};

const createCareer = (req, res, next) => {
    schema.title = {type: 'string', min: 2};
    process(req, res, next, schema);
};

const register = (req, res, next) => {
    const schema = {
        'name': {type: 'string', min: 2},
        'title': {type: 'string', min: 2}
    };
    process(req, res, next, schema);
};

const process = (req, res, next, schema) => {
    if (validator.validate(req.body, schema) === true) {
        next();
    } else {
        res.status(400).send(validator.validate(req.body, schema));
    }
};

const moduleConstructor = () => {
    return {
        createStudent: createStudent,
        createCareer: createCareer,
        createSubject: createSubject,
        register: register
    };
};

module.exports = moduleConstructor;