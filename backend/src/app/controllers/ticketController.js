const express = require('express');
const ticket = require('../models/ticket');
const router = express.Router();
const {
    check,
    validationResult
} = require('express-validator');
const db = require('../utilities/sqlMapper');
var fs = require('fs');



//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// get ticket_id & print html table
router.get('/:ticket_id', [

    check('ticket_id', 'id should be an integer').isInt(),

], (req, res, next) => {
    const errors = validationResult(req);
    console.log("Error in auth---------" + JSON.stringify(errors));

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    ticket.get(req, function (err, result) {
        if (err) {

            res.status(400).json(err);
        } else {
            console.log("result", result);
            if (result.message == "ticket Doesnot exist") {
                res.status(200).json(result);

            } else {
                let randomArray = ticket.generateSquare();
                console.log("RANDOM ARRAY", randomArray);
                let html_table = `<html>
    <head>
    <style>
   
    #bingo {
        width: 30%;
      }
    #bingo, #bingo th, #bingo td {
    border: 1px solid black;
    padding: 14px;
    }
    #bingo tr:nth-child(even){background-color: #f2f2f2;}
    #bingo th {
        padding-top: 12px;
        padding-bottom: 12px;
        text-align: left;
        background-color: #4CAF50;
        color: white;
      }
    </style>
    </head>
    <body >
    <h1><marquee behavior="scroll" direction="left">PLAY BINGO!!!</marquee></h1>
    <h2 style="color:#FF0000">GAME-ID:` + result.data.game_id + `</h2>
    <h2 style="color:#FF0000">TICKET-ID:` + result.data.ticket_id + `</h2>
    <br>
     
    <table id="bingo">
    <tr>
    <th>B</th>
    <th>I</th>
    <th>N</th>
    <th>G</th>
    <th>O</th>
    
    
    </tr>
    <tr>
    <td>` + randomArray[0] + `</td>
    <td>` + randomArray[1] + `</td>
    <td>` + randomArray[2] + `</td>
    <td>` + randomArray[3] + `</td>
    <td>` + randomArray[4] + `</td>
    </tr>
    <tr>
    <td>` + randomArray[5] + `</td>
    <td>` + randomArray[6] + `</td>
    <td>` + randomArray[7] + `</td>
    <td>` + randomArray[8] + `</td>
    <td>` + randomArray[9] + `</td>
    </tr>
    <tr>
    <td>` + randomArray[10] + `</td>
    <td>` + randomArray[11] + `</td>
    <td>` + randomArray[12] + `</td>
    <td>` + randomArray[13] + `</td>
    <td>` + randomArray[14] + `</td>
    </tr>
    <tr>
    <td>` + randomArray[15] + `</td>
    <td>` + randomArray[16] + `</td>
    <td>` + randomArray[17] + `</td>
    <td>` + randomArray[18] + `</td>
    <td>` + randomArray[19] + `</td>
    </tr>
    <tr>
    <td>` + randomArray[20] + `</td>
    <td>` + randomArray[21] + `</td>
    <td>` + randomArray[22] + `</td>
    <td>` + randomArray[23] + `</td>
    <td>` + randomArray[24] + `</td>
    </tr>
    
    
    </table>
    <br>

    <a href="http://localhost:8002/api/game/` + result.data.game_id + `/stats">Current Game Stats</a>
    </body>
    </html>`;
                console.log("HTML TABLE UPDATED", html_table);
                // fs.writeFile('index.html', html_table, function (err) {
                //     if (err) throw err;
                //     console.log('Saved!');
                    res.send(html_table);
                    // res.sendfile('index.html', {
                    //     root: '/home/amit/docker/bingo/backend'
                    // });

                // });
            }
        }
    });
});


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// generate ticket_id for a game_id & user
router.post('/:game_id/ticket/:username/generate/', (req, res, next) => {

    ticket.createTicket(req, function (err, result) {
        console.log('error', err);
        if (err) {
            res.status(400).json(err);
        } else {

            res.status(201).json(result);
        }

    });
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = router;