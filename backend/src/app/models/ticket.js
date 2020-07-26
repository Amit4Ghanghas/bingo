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
function get(req, callback) {

    try {
        let columns = `t.*`;
        let options = {
            id: req.params.id,
            from: dbTable + tableAlias,
            conditions: " ticket_id = " + req.params.ticket_id,
            columns: columns
        }
        db.select(options, function (err, result) {
            if (err) {
                return callback(err);
            } else {
                console.log("RESULT", result);
                if (result.rowCount > 0) {

                    return callback(null, {
                        message: "Success",
                        data: {
                            ticket_id: result.rows[0].ticket_id,
                            game_id: result.rows[0].game_id
                        }
                    })
                } else {
                    return callback(null, {
                        message: "ticket Doesnot exist"
                    })
                }
            }
        });
    } catch (error) {
        return callback(error);
    }
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createTicket(req, callback) {
    try {
        req.body.game_id = req.params.game_id;
        req.body.user_name = req.params.username;
        let columns = `g.*`;
        let options = {
            id: req.params.id,
            from: 'game g',
            conditions: " game_id = " + req.params.game_id,
            columns: columns
        }
        db.select(options, function (err, result) {
            if (err) {
                return callback(err);
            } else {
                console.log("AAAA", result);
                if (result.rowCount > 0) {
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
                                let columns = `t.*`;

                                let orderBy = {
                                    by: " t.ticket_id",
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
                                        let ticket_id = getresult.rows[0];
                                        return callback(null, {
                                            message: "ticket generated successfully",
                                            data: getresult.rows
                                        })
                                    }
                                });
                            } else {
                                return callback(null, {
                                    message: "Problem in creating a ticket"
                                })
                            }

                        }
                    });
                } else {
                    return callback(null, {
                        message: "Game didn't not exist"
                    })
                }
            }
        });
    } catch (error) {
        return callback(error);
    }
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = {

    get,
    createTicket,
    generateSquare

}