const express = require('express');
const game = require('../models/game');
const router = express.Router();
const {
    check,
    validationResult
} = require('express-validator');
const db = require('../utilities/sqlMapper');



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// get number_spoken in game
router.get('/:game_id/numbers', [

    check('game_id', 'game_id should be an integer').isInt(),

], (req, res, next) => {
    const errors = validationResult(req);
    console.log("Error in auth---------" + JSON.stringify(errors));

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    // game.numberSpokenInGame(req, function (err, result) {
    //     if (err) {

    //         res.status(400).json(err);
    //     } else {
    //         console.log("result", result);

    //         res.status(200).json(result);

    //     }

    // });

    game.numberSpokenInGame().then((result) =>{
        console.log("RR",result);
        // res.status(200).json(result);
        return new Promise((resolve, reject) => { 
            // setTimeout(() => resolve(result), 1000);
            resolve(result);
          });
    }).then((result) =>{
        console.log("RR in 2nd then",result);
        res.status(200).json("2nd then");

    }).catch((error)=>{
        console.log("CATCH");
        res.status(400).json(error);

    })
  
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// get stats of game
router.get('/:game_id/stats', [

    check('game_id', 'game_id should be an integer').isInt(),

], (req, res, next) => {
    const errors = validationResult(req);
    console.log("Error in auth---------" + JSON.stringify(errors));

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    game.gameStats(req, function (err, result) {
        if (err) {

            res.status(400).json(err);
        } else {
            console.log("result", result);

            res.status(200).json(result);

        }

    });
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// get ticket_id & print html table
router.get('/:game_id/number/random', [

    check('game_id', 'game_id should be an integer').isInt(),

], (req, res, next) => {
    const errors = validationResult(req);
    console.log("Error in auth---------" + JSON.stringify(errors));

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    game.uniqueRandomNumber(req, function (err, result) {
        if (err) {

            res.status(400).json(err);
        } else {
            console.log("result", result);

            res.status(200).json(result);

        }

    });
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// for creating game
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

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports = router;