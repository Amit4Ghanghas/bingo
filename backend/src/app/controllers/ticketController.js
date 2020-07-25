const express = require('express');
const ticket = require('../models/ticket');
const router = express.Router();
const {
    check,
    validationResult
} = require('express-validator');
const db = require('../utilities/sqlMapper');

router.post('/:game_id/ticket/:username/generate/', (req, res, next) => {

    ticket.createTicket(req, function (err, result) {
        console.log('error', err);
        if (err) {
            res.status(400).json(err);
        } else {
           
            res.status(200).json(result);
        }

    });
});


module.exports = router;