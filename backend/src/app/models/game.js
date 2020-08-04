const db = require('../utilities/sqlMapper');
var dbTable = "public.game";
var tableAlias = " g ";
var dbFields = ['game_id', 'game_name', 'numbers_spoken'];

////////////////////////////////////////////////////////////////////////////////////////////////////////
async function callNumber(numberSpoken, game_id) {
    var rand = Math.floor(Math.random() * 75) + 1; // random number between 1 and 75
    // if the number is in the array (already been called)
    if (numberSpoken.includes(rand))
        callNumber();
    else {
        numberSpoken.push(rand);
        let object = {
            game_id,
            numbers_spoken: `'` + numberSpoken + `'`
        }
        let result = await update(object);
        return rand;


    }
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function gameStats(req) {

    // try {
    console.log('1.1');
    let columns = `g.*`;
    let options = {
        from: dbTable + tableAlias,
        conditions: " game_id = " + req.params.game_id,
        columns: columns
    }
    console.log('2');
    let err = new Array();

    let result = await db.select(options).catch((e) => err.push(e));
    if (err.length > 0) {
        throw new Error('Error in fetching data from db');
    }

    let columns1 = `COUNT(ticket_id)`;
    let options1 = {
        id: req.params.id,
        from: 'ticket t',
        conditions: " game_id = " + req.params.game_id,
        columns: columns1
    }
    let err1 = new Array();

    let result1 = await db.select(options1).catch((e) => err1.push(e));
    if (err1.length > 0) {
        throw new Error('Error in fetching data from db');
    }
    let numberArray = result.rows[0].numbers_spoken;
    let Finalresult = {
        message: "Success",
        spokenNumber: numberArray,
        no_of_tickets: result1.rows[0].count
    };
    return Finalresult;

}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function numberSpokenInGame(req) {
    console.log("2", req.params);

    let columns = `g.*`;
    let options = {
        from: dbTable + tableAlias,
        conditions: " game_id = " + req.params.game_id,
        columns: columns
    }
    let err = new Array();

    let result = await db.select(options).catch((e) => err.push(e));
    if (err.length > 0) {
        throw new Error('Error in fetching data from db');
    }
    console.log("RESULT", result);
    let numberArray = result.rows[0].numbers_spoken;
    let Finalresult = {
        message: "Success",
        spokenNumber: numberArray
    };
    return Finalresult;

}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function uniqueRandomNumber(req) {

    let columns = `g.*`;
    let options = {
        from: dbTable + tableAlias,
        conditions: " game_id = " + req.params.game_id,
        columns: columns
    }
    let err = new Array();

    let result = await db.select(options).catch((e) => err.push(e));
    if (err.length > 0) {
        throw new Error('Error in fetching data from db');
    }
    if (result.rowCount > 0) {
        let numberArray = result.rows[0].numbers_spoken;
        if (numberArray == null) {
            numberArray = [];
        }
        if (numberArray.length < 75) {
            let random_number = await callNumber(numberArray, req.params.game_id);
            return {
                message: "Success",
                spokenNumber: random_number
            };
        } else {
            return {
                message: "Game Over"
            };
        }
    } else {
        return {
            message: "game Doesnot exist"
        };

    }
}

// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//add api of game table
async function create(req) {
        let data = req.body;
        if (!data.game_name) {
            data.game_name = "TestGame";
        }
        let delim = "";
        let columns = "";
        let values = "";
        let submit = true;
        console.log("req--------------", req.body);
        for (let key in data) {
            if (data[key] == null) {
                console.log("skipping null values");
            } else {
                if (dbFields.includes(key)) {
                    columns += delim + key;
                    values += db.insertString(key, data[key], delim);
                    delim = ",";
                }
            }

        }

        let options = {
            table: dbTable,
            columns: columns,
            values: values
        }
        let err = new Array();

        let result = await db.insert(options).catch((e) => err.push(e));
        if (err.length > 0) {
            throw new Error('Error in posting data in db');
        }
        console.log("Result", result);
        let conditions1 = "";
        let columns1 = `g.*`;

        let orderBy1 = {
            by: " g.game_id",
            order: "DESC"
        };


        let options1 = {
            columns: columns1,
            from: dbTable + tableAlias,
            conditions: conditions1,
            orderBy: orderBy1,
            limit: {
                limit: 1
            }
        }
        let err1 = new Array();

        let result1 = await db.select(options1).catch((e) => err1.push(e));
        if (err1.length > 0) {
            throw new Error('Error in fetching data from db');
        }
                  
        let game_id = result1.rows[0];
        return  {
            message: "game created successfully",
            data: result1.rows
        };
              
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function update(object, callback) {
    let data = object;
    let delim = "";
    let setValues = "";
    let conditions = "game_id = " + object.game_id;
    console.log("data--->", data)
    for (let key in data) {
        if (dbFields.includes(key)) {
            if (key != 'numbers_spoken') {
                setValues += db.updateString(key, data[key], delim);
            } else {
                var newStr = "{" + data[key].substring(1, data[key].length - 1) + "}";
                setValues += db.updateString(key, newStr, delim);
            }
            delim = ",";
        }
    }

    let options = {
        table: dbTable,
        setValues: setValues,
        conditions: conditions
    };
    let err = new Array();

    let result = await db.update(options).catch((e) => err.push(e));
    if (err.length > 0) {
        throw new Error('Error in fetching data from db');
    }
    return 1;

}

//////////////////////////////////////////////////////////////////////////////////////////////////////////// 

module.exports = {

    create,
    uniqueRandomNumber,
    numberSpokenInGame,
    gameStats

}