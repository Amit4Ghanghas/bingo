const db = require('../utilities/sqlMapper');
var dbTable = "public.game";
var tableAlias = " g ";
var dbFields = ['game_id', 'game_name','numbers_spoken'];


function randomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

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
                    // let random_number = randomNumber(1, 25);
                    // console.log("RESULT IN RANDOM", numberArray, random_number);
                 
                    // if (numberArray.length = 0) {
                    //     numberArray.push(random_number);
                    // } else {
                    //     let n = numberArray.includes(random_number);
                    //     console.log("N is ", n);
                    //     if (n == true) {
                    //         console.log("Number exist in array");
                    //     } else {
                    //         numberArray.push(random_number);
                    //         console.log("TYPE OF NUMARRAY====",typeof(numberArray),numberArray);

                    //         let object = {
                    //             game_id:req.params.game_id,
                    //             numbers_spoken : numberArray
                    //         }
                    //         console.log("TYPE OF NUMARRAY",typeof(numberArray),numberArray);
                    //         // update(object);
                    //         return callback(null, {
                    //             message: "Success",
                    //             unique_random_number: random_number,
                    //             array: numberArray
                    //         })
                    //     }
                    // }


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

// ////////////////////////////add api of game table
function create(req, callback) {
    try {
        let data = req.body;
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

function update(object,callback) {
    let data = object;
    let delim = "";
    let setValues = "";
    let conditions = "game_id = " + object.game_id;

    console.log("data--->", data)
    for (let key in data) {
        if (dbFields.includes(key)) {
            setValues += db.updateString(key, data[key], delim);
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
                callback(null, result);
            } catch (error) {
                return callback(error);
            }
        }
    });
}



function generateTicket() {
    // set all elements in usedNumbers array as false
    resetUsedNumbers();
    // loops 24 times because there are 24 squares (not including free square)
    for (var i = 0; i < 25; i++) {
        if (i == 12) // skip free square
            continue;
        // generates a number for each square
        generateSquare(i);
    }
}



 

module.exports = {

    create,
    uniqueRandomNumber

}