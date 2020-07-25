const express = require('express');
const ticket = require('../models/ticket');
const router = express.Router();
const {
    check,
    validationResult
} = require('express-validator');
const db = require('../utilities/sqlMapper');
var fs = require('fs');


router.get('/:ticket_id', [

    check('ticket_id', 'id should be an integer').isInt(),

], (req, res, next) => {
    const errors = validationResult(req);
    console.log("Error in auth---------" + JSON.stringify(errors));

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    ticket.get(req, function(err, result) {
        if (err) {
           
            res.status(400).json(err);
        } else {
            console.log("result",result);
            if(result.message == "ticket Doesnot exist"){
            res.status(200).json(result);

            }else{ 
            let html_table = `<html>
            <head>
            <style>
            table, th, td {
              border: 1px solid black;
            }
            </style>
            </head>
            <body>
            
            <h1>PLAY BINGO</h1>
            <h2>TicketID:`+result.data.ticket_id+`</h2>
            
            
            <table>
              <tr>
                  <th>B</th>
                <th> I </th>
               <th>N</th>
                <th>G</th>
               <th>O</th>
               
               
              </tr>
              <tr>
                <td>1</td>
                <td>2</td>
                <td>3</td>
                <td>4</td>
                <td>5</td>
              </tr>
              <tr>
                <td>6</td>
                <td>7</td>
                <td>8</td>
                <td>9</td>
                <td>10</td>
              </tr>
               <tr>
                <td>11</td>
                <td>12</td>
                <td>13</td>
                <td>14</td>
                <td>15</td>
              </tr>
              <tr>
                <td>16</td>
                <td>17</td>
                <td>18</td>
                <td>19</td>
                <td>20</td>
              </tr>
               <tr>
                <td>21</td>
                <td>22</td>
                <td>23</td>
                <td>24</td>
                <td>25</td>
              </tr>
            
            
            </table>
            
            </body>
            </html>`;
            console.log("HTML TABLE UPDATED",html_table);
            fs.writeFile('index.html', html_table, function (err) {
                if (err) throw err;
                console.log('Saved!');
            res.sendfile('index.html',{root:'/home/amit/docker/bingo/backend'});

              });
            }
        }
    });
});


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


module.exports = router;