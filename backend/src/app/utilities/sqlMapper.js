var db = require('../../config/postgresql');

// Open the DB connection, execute the sql query and close the db connection
function executeQuery(sql, callback) {
    try {
        console.log("--------------------------in execute query")
        db.connectionPool.query(sql, function (error, results) {
            if (error) {
                return callback( (error));
            } else {

                return callback(null, results);
            }
        });
    }
    catch (error) {
        return callback( (error));
    }
}

// Select query builder function
function select(options = {}, callback) {
    try {
        let sql = "";
        let columns = "";
        let from = "";
        let joins = "";
        let conditions = "";
        let groupBy = "";
        let orderBy = "";
        let limit = "";

        let select = "SELECT ";
        if (options.columns) { columns = " " + options.columns; } else { columns = " *"; }
        if (options.from) { from = " FROM " + options.from; }
        if (options.joins) {
            options.joins.forEach(join => {
                joins += " " + join.type + " JOIN " + join.table + " ON " + join.on;
            });
        }
        if (options.conditions) { conditions = " WHERE " + options.conditions; } else { conditions = " WHERE 1 = 1 "; }
        console.log('step-1');
        if (options.IN) {
            let arr = options.IN.list
            conditions += " AND " + options.IN.attribute + " IN ("
            for (i = 0; i < arr.length - 1; i++) {
                conditions += arr[i] + ","
            }
            conditions += arr[i] + ") "
        }
      
        if (options.groupBy) {
            groupBy += " GROUP BY (" + options.groupBy.by + ") ";
        }
        if (options.orderBy) {
            orderBy += " ORDER BY";
            if (options.orderBy[0]) {
                let delim = " ";
                options.orderBy.forEach(o => {
                    orderBy += delim + o.by + " " + o.order;
                    delim = ", ";
                })
            } else {
                let o = options.orderBy;
                orderBy += " " + o.by + " " + o.order;
            }
        }
        if (options.limit) {
            if (options.limit.limit && options.limit.limit > 0) {
                // let start = 0;
                if (options.limit.start) { start = options.limit.start; }

                limit = " LIMIT " + options.limit.limit;
            }
        }
        sql += select + columns + from + joins + conditions + groupBy + orderBy + limit;

        console.log('-------------------------QUERY -------------------------------------------------------', sql);

        executeQuery(sql, function (err, data) {
            console.log("in select of sql mapper", data);
            if (err) {
                return callback( (err));
            } else {
                return callback(null, data);
            }
        });
    } catch (error) {
        return callback( (error));
    }
}

// Insert query builder function
function insert(options = {}, callback) {
    try {
        if(!options.multipleValues){
            options.values= "(" + options.values + ")"
        }
        else{
            options.values=options.multipleValues
        }
        let sql = "INSERT INTO " + options.table + " (" + options.columns + ") VALUES " + options.values;
        console.log('QUERY', sql);
        executeQuery(sql, function (err, data) {
            if (err) {
                return callback( (err));
            } else {
                return callback(null, data);
            }
        });
    } catch (error) {
        return callback( (error));
    }
}

// Update query builder function
function update(options = {}, callback) {
    let conditions = ""
    let sql = "";
    try {
        if (options.IN) {
            let arr = options.IN.list
            conditions += options.IN.attribute + " IN ("
            for (i = 0; i < arr.length - 1; i++) {
                conditions += arr[i] + ","
            }
            conditions += arr[i] + ") "
        }
        if (options.conditions) {
            if (options.IN) {
                conditions += " AND " + options.conditions
            }
            else {
                conditions += options.conditions
            }
        }
        if (conditions && conditions != "") {
            sql = "UPDATE " + options.table + " SET " + options.setValues + "WHERE " + conditions;
        }
        console.log('QUERY', sql);
        executeQuery(sql, function (err, data) {
            if (err) {
                return callback( (err));
            } else {
                return callback(null, data);
            }
        });
    } catch (error) {
        return callback( (error));
    }
}

// Remove query builder function (here we are updating is_removed field with 1)
function remove(options = {}, callback) {
    try {
        let sql = "";
        if (options.conditions && options.conditions != "") {
            sql = "UPDATE " + options.table + " SET is_removed = true ,updated_at=current_timestamp WHERE " + options.conditions;
        }
        console.log('QUERY', sql);
        executeQuery(sql, function (err, data) {
            if (err) {
                return callback( (err));
            } else {
                return callback(null, data);
            }
        });
    } catch (error) {
        return callback( (error));
    }
}

// DELETE query builder function (here we are deleting the row)
function permanentremove(options = {}, callback) {

    try {
        let sql = "";
        if ((options.conditions && options.conditions != "" && !options.conditions.includes(null)) && (options.table && options.table != "")) {
            sql = "DELETE FROM " + options.table + " WHERE " + options.conditions;
            console.log("SQL-------" + sql);

            executeQuery(sql, function (err, data) {
                try {
                    if (err) {
                        return callback(err);
                    } else {
                        return callback(null, data);
                    }
                } catch (error) {
                    return callback(error);
                }
            });
        }
    } catch (error) {
        return callback(error);
    }
}

// This function returns the values part of insert query
function insertString(key, val, delim) {
    try {
        let str = "";
        if (key == 'created_by') { val = global.user.user_id; }
        if (val == null) {
            str = "";
        } else if (val == 'null') {
            str = "";
        } else if (typeof val == 'object') {
            str = delim + db.escape.string(JSON.stringify(val));
        } else {
            str = delim + "'" + db.escape.string(val.toString()) + "'";
        }
        return str;
    } catch (error) {
        return  (error);
    }
}

// This function returns the set part of the update query
function updateString(key, val, delim) {
    try {
        let str = "";
        if (key == 'updated_by') { val = global.user.user_id; }

        if (val == null) {
            str = "";
        }
        else if (val == 'null') {
            str = delim + key + " = " + db.escape.string(val);
        }
        else if (typeof val == 'object') {
            str = delim + key + " = " + db.escape.string(JSON.stringify(val));
        }
        else {
            str = delim + key + " = " + "'" + db.escape.string(val) + "'";
        }
        return str;
    } catch (error) {
        return  (error);
    }
}

function camelize(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
        if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
        return index === 0 ? match.toLowerCase() : match.toUpperCase();
    });
}


// With this function we can directly execute the whole sql query in model, controller or services
function query(sql, callback) {
    try {
        console.log('IN mapper query ', sql);

        executeQuery(sql, function (err, result) {
            if (err) {
                return callback( (err));
            } else {

                return callback(null, result);
            }
        });
    } catch (error) {
        return callback( (error));
    }
}

// This is used to append the single codes in sql query
function escape(data) {
    try {
        console.log("Type: ", data + typeof (data));
        if (typeof (data) == 'number' || typeof (data) === 'boolean') {
            return data;
        } else {
            // data.replace("'", "\'");
            // return "'" + data + "'";
            return "'" + db.escape.string(data) + "'";
        }
    } catch (error) {
        return  (error);
    }
}


// Here we are exporting all the above function to use in another files like model, controller and services
module.exports = {
    query: query,
    select: select,
    insert: insert,
    update: update,
    remove: remove,
    permanentremove: permanentremove,
    updateString: updateString,
    insertString: insertString,
    escape: escape,
    camelize
}