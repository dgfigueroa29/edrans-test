'use strict';

const Career = require('../model/career');

const getCareer = (id, res) => {
    Career.findById(id, (error, it) => {
        if (error) {
            return res.status(500).send({'error': error});
        } else {
            if (!it) {
                return res.status(404).send({message: 'Not found'});
            }

            return it;
        }
    });
};