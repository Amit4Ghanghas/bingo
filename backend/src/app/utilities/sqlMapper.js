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
                if (options.limit.start) { start = options.limit.start; }

                limit = " LIMIT " + options.limit.limit;
            }
        }
        sql += select + columns + from + joins + conditions  + orderBy + limit;

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
     
        if (options.conditions) {
            
                conditions += options.conditions
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



// This function returns the values part of insert query
function insertString(key, val, delim) {
    try {
        let str = "";
       
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



// This is used to append the single codes in sql query
function escape(data) {
    try {
        console.log("Type: ", data + typeof (data));
        if (typeof (data) == 'number' || typeof (data) === 'boolean') {
            return data;
        } else {
           
            return "'" + db.escape.string(data) + "'";
        }
    } catch (error) {
        return  (error);
    }
}


// Here we are exporting all the above function to use in another files like model, controller and services
module.exports = {

    select: select,
    insert: insert,
    update: update,
    updateString: updateString,
    insertString: insertString,
    escape: escape
}