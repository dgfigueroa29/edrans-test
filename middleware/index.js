'use strict';
const lodash = require('lodash'),
    validator = require('validator'),
    FasterValidator = require('fastest-validator'),
    fasterValidator = new FasterValidator(),
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
    const schemaRegister = {
        'name': {type: 'string', min: 2},
        'title': {type: 'string', min: 2}
    };
    process(req, res, next, schemaRegister);
};

const checkId = (req, res, next) => {
    if (!lodash.isUndefined(req.params.id)) {
        if (validator.isMongoId(req.params.id)) {
            next();
        } else {
            res.status(400).send({"error": "Missing or invalid id"});
        }
    } else {
        res.status(400).send({"error": "Missing or invalid id"});
    }
};

const process = (req, res, next, schema) => {
    if (fasterValidator.validate(req.body, schema) === true) {
        next();
    } else {
        res.status(400).send(fasterValidator.validate(req.body, schema));
    }
};

const moduleConstructor = () => {
    return {
        createStudent: createStudent,
        createCareer: createCareer,
        createSubject: createSubject,
        register: register,
        checkId: checkId
    };
};

module.exports = moduleConstructor;