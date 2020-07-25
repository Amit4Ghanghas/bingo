const db = require('../utilities/sqlMapper');
var dbTable = "public.game";
var tableAlias = " g ";
var dbFields = ['game_id','game_name'];



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

            db.insert(options, function(err, result) {
                if (err) {

                    return callback(err);
                } else {
                    console.log("Result",result);
                    if(result.rowCount>0){ 
                        let conditions = "";
                        let columns = `g.*`;
            
                        let orderBy = {
                            by: " g.game_id",
                            order: "DESC"
                        };
            
                  
                    let options = {
                        columns: columns,
                        from:  dbTable + tableAlias,
                        conditions: conditions,
                        orderBy: orderBy,
                        limit: {limit: 1 }
                    }
            
                    db.select(options, function(err, getresult) {
                        if (err) {
                            return callback(err);
                        } else {
                                   console.log("GET RSULT",getresult);
                                   let game_id = getresult.rows[0];
                                   return callback(null,{message:"game created successfully",data:getresult.rows})          
                                }
                            });
                        }else{
                            return callback(null,{message:"Problem in creating a game"})
                        }
                   
                }
            });
     
    } catch (error) {
        return callback(error);
    }
}


module.exports = {
 
    create

}