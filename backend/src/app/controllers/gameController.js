const express = require('express');
const game = require('../models/game');
const router = express.Router();
const {
    check,
    validationResult
} = require('express-validator');
const db = require('../utilities/sqlMapper');



router.post('/create/', (req, res, next) => {

    game.create(req, function (err, result) {
        console.log('error', err);
        if (err) {
           
            res.status(400).json(err);
        } else {
           
            res.status(201).json(result);
        }

    });
});


module.exports = router;