const db = require('../utilities/sqlMapper');
var dbTable = "public.game";
var tableAlias = " g ";
var dbFields = ['game_id', 'game_name', 'numbers_spoken'];

////////////////////////////////////////////////////////////////////////////////////////////////////////
function callNumber(numberSpoken, game_id) {
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
        update(object, (err, result) => {
            if (err) {
                throw err;
            }
        });
        return rand;


    }
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
function gameStats(req, callback) {

    try {

        let columns = `g.*`;
        let options = {
            id: req.params.id,
            from: dbTable + tableAlias,
            conditions: " game_id = " + req.params.game_id,
            columns: columns
        }
        db.select(options, function (err, result) {
            if (err) {
                return callback(err);
            } else {

                let columns = `COUNT(ticket_id)`;
                let options = {
                    id: req.params.id,
                    from: 'ticket t',
                    conditions: " game_id = " + req.params.game_id,
                    columns: columns
                }
                db.select(options, function (err, result1) {
                    if (err) {
                        return callback(err);
                    } else {
                        let numberArray = result.rows[0].numbers_spoken;
                        return callback(null, {
                            message: "Success",
                            spokenNumber: numberArray,
                            no_of_tickets: result1.rows[0].count
                        });
                    }
                });

            }
        });
    } catch (error) {
        return callback(error);
    }
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// function numberSpokenInGame(req, callback) {

//     try {

//         let columns = `g.*`;
//         let options = {
//             id: req.params.id,
//             from: dbTable + tableAlias,
//             conditions: " game_id = " + req.params.game_id,
//             columns: columns
//         }
//         db.select(options, function (err, result) {
//             if (err) {
//                 return callback(err);
//             } else {
//                 console.log("RESULT", result);
//                 let numberArray = result.rows[0].numbers_spoken;
//                 return callback(null, {
//                     message: "Success",
//                     spokenNumber: numberArray
//                 });
//             }
//         });
//     } catch (error) {
//         return callback(error);
//     }
// }

function numberSpokenInGame(req) {
    return new Promise(function (resolve, reject) {
        let err = "err"
        if (err == "err") {
            return reject(err);
        } else {
            let Finalresult = {
                message: "Success for promise"
            }
            console.log("Final", Finalresult);
            return resolve(Finalresult);
        }
    });
}


//   numberSpokenInGame();
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function uniqueRandomNumber(req, callback) {

    try {

        let columns = `g.*`;
        let options = {
            id: req.params.id,
            from: dbTable + tableAlias,
            conditions: " game_id = " + req.params.game_id,
            columns: columns
        }
        db.select(options, function (err, result) {
            if (err) {
                return callback(err);
            } else {
                console.log("RESULT", result);
                if (result.rowCount > 0) {
                    let numberArray = result.rows[0].numbers_spoken;
                    if (numberArray == null) {
                        numberArray = [];
                    }
                    if (numberArray.length < 75) {
                        let random_number = callNumber(numberArray, req.params.game_id);
                        return callback(null, {
                            message: "Success",
                            spokenNumber: random_number
                        });
                    } else {
                        return callback(null, {
                            message: "Game Over"
                        });
                    }
                } else {
                    return callback(null, {
                        message: "game Doesnot exist"
                    })
                }
            }
        });
    } catch (error) {
        return callback(error);
    }
}

// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//add api of game table
function create(req, callback) {
    try {
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

        db.insert(options, function (err, result) {
            if (err) {

                return callback(err);
            } else {
                console.log("Result", result);
                if (result.rowCount > 0) {
                    let conditions = "";
                    let columns = `g.*`;

                    let orderBy = {
                        by: " g.game_id",
                        order: "DESC"
                    };


                    let options = {
                        columns: columns,
                        from: dbTable + tableAlias,
                        conditions: conditions,
                        orderBy: orderBy,
                        limit: {
                            limit: 1
                        }
                    }

                    db.select(options, function (err, getresult) {
                        if (err) {
                            return callback(err);
                        } else {
                            console.log("GET RSULT", getresult);
                            let game_id = getresult.rows[0];
                            return callback(null, {
                                message: "game created successfully",
                                data: getresult.rows
                            })
                        }
                    });
                } else {
                    return callback(null, {
                        message: "Problem in creating a game"
                    })
                }

            }
        });

    } catch (error) {
        return callback(error);
    }
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
function update(object, callback) {
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
    db.update(options, function (err, result) {
        if (err) {
            return callback(err);
        } else {
            try {
                callback(null, 1);
            } catch (error) {
                return callback(error);
            }
        }
    });
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////// 

module.exports = {

    create,
    uniqueRandomNumber,
    numberSpokenInGame,
    gameStats

}