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

], async (req, res, next) => {
    const errors = validationResult(req);
    console.log("Error in auth---------" + JSON.stringify(errors));

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    try {
        let result = await game.numberSpokenInGame(req);
        res.status(200).json(result);

    } catch (error) {
        res.status(400).json(error);

    }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// get stats of game
router.get('/:game_id/stats', [

    check('game_id', 'game_id should be an integer').isInt(),

], async (req, res, next) => {
    const errors = validationResult(req);
    console.log("Error in auth---------" + JSON.stringify(errors));

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    try {
        let result = await game.gameStats(req);
        res.status(200).json(result);

    } catch (error) {
        res.status(400).json(error);

    }
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// get ticket_id & print html table
router.get('/:game_id/number/random', [

    check('game_id', 'game_id should be an integer').isInt(),

], async (req, res, next) => {
    const errors = validationResult(req);
    console.log("Error in auth---------" + JSON.stringify(errors));

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    try {
        let result = await game.uniqueRandomNumber(req);
        res.status(200).json(result);

    } catch (error) {
        res.status(400).json(error);

    }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// for creating game
router.post('/create/', async (req, res, next) => {

    try {
        let result = await game.create(req);
        res.status(200).json(result);

    } catch (error) {
        res.status(400).json(error);

    }
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports = router;