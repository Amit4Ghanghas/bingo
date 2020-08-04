const db = require('../utilities/sqlMapper');
var dbTable = "public.ticket";
var tableAlias = " t ";
var dbFields = ['ticket_id', 'game_id', 'user_name'];

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function generateSquare() {

    let ticket = new Array(25);
    let usedNumbers = new Array(76);
    for (var i = 0; i < usedNumbers.length; i++) {
        usedNumbers[i] = 0;
    }
    var temp = new Array(0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 0, 1, 2, 3, 4);

    for (let i = 0; i < 25; i++) {
        let newNumber = (temp[i] * 15) + generateNewNum();
        while (usedNumbers[newNumber] == 1) {
            newNumber = (temp[i] * 15) + generateNewNum();
        }
        ticket[i] = newNumber;
        usedNumbers[newNumber] = 1;
    }
    console.log("TICKET ", ticket);
    return ticket;

}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function generateNewNum() {
    return Math.floor((Math.random() * 15) + 1);
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////// get by id api of ticket table
async function get(req) {

        let columns = `t.*`;
        let options = {
            id: req.params.id,
            from: dbTable + tableAlias,
            conditions: " ticket_id = " + req.params.ticket_id,
            columns: columns
        }
        let err = new Array();

        let result = await db.select(options).catch((e) => err.push(e));
        if (err.length > 0) {
            throw new Error('Error in fetching data from db');
        }
            console.log("RESULT", result);
        if (result.rowCount > 0) {

            return  {
                message: "Success",
                data: {
                    ticket_id: result.rows[0].ticket_id,
                    game_id: result.rows[0].game_id
                }
            };
        } else {
            return  { message: "ticket Doesnot exist"};
        }
         
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function createTicket(req) {
    req.body.game_id = req.params.game_id;
    req.body.user_name = req.params.username;
    let columns = `g.*`;
    let options = {
        from: 'game g',
        conditions: " game_id = " + req.params.game_id,
        columns: columns
    }
    let err = new Array();
    console.log("---",req.body,req.params);

    let result = await db.select(options).catch((e) => err.push(e));
    if (err.length > 0) {
        throw new Error('Error in fetching data from db');
    }
    console.log("RESULT IN 1st",result.rows);
    if (result.rowCount > 0) {
        let data = req.body;
        let delim = "";
        let columns1 = "";
        let values = "";
        console.log("req--------------", req.body);

        for (let key in data) {
            if (data[key] == null) {
                console.log("skipping null values");
            } else {
                if (dbFields.includes(key)) {
                    columns1 += delim + key;
                    values += db.insertString(key, data[key], delim);
                    delim = ",";
                }
            }

        }

        let options1 = {
            table: dbTable,
            columns: columns1,
            values: values
        }
        let err1 = new Array();

        let result1 = await db.insert(options1).catch((e) => err1.push(e));
        if (err1.length > 0) {
            throw new Error('Error in posting data in db');
        }
        let conditions2 = "";
        let columns2 = `t.*`;

        let orderBy2 = {
            by: " t.ticket_id",
            order: "DESC"
        };


        let options2 = {
            columns: columns2,
            from: dbTable + tableAlias,
            conditions: conditions2,
            orderBy: orderBy2,
            limit: {
                limit: 1
            }
        }
        let err2 = new Array();

        let result2 = await db.select(options2).catch((e) => err2.push(e));
        if (err2.length > 0) {
            throw new Error('Error in fetching data from db');
        }

        return {
            message: "ticket generated successfully",
            data: result2.rows
        };

    } else {
        return {
            message: "Game didn't not exist"
        };
    }


}
// createTicket();
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = {

    get,
    createTicket,
    generateSquare

}