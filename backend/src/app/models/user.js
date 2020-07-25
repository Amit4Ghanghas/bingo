const db = require('../utilities/sqlMapper');
var dbTable = "public.users";
var tableAlias = " u ";
var dbFields = ['user_id', 'name','email','phone','type','password','location','is_active','is_approved','created_at', 'updated_at','wso2_id','image_url','plant_id'];


////// get api of user
function get(req, callback) {
    try {
        let conditions = " u.type != 'PLANT_ADMIN' AND u.type != 'PANASONIC_ADMIN' AND is_approved = 1";
        let sql = "";
        let columns = `u.*,p.plant_name as plant_name`;
        // console.log('AB--------------------------------CD', global.user.testtaker_id);

        let orderBy = {
            by: " u.user_id",
            order: "DESC"
        };


        if (req.query.fromDate) {
            conditions += ` AND  DATE(created_at) >= '` + req.query.fromDate + `'`;
        }

        if (req.query.toDate) {
            conditions += ` AND  DATE(created_at) <= '` + req.query.toDate + `'`;
        }


      

        if (req.query.is_approved) {
            conditions += ` AND u.is_approved = '` + req.query.is_approved + `'`;
        }

        if (req.query.type) {
            conditions += ` AND u.type = '` + req.query.type + `'`;
        }

        if (req.query.plant_id) {
            conditions += `AND u.plant_id = '` + req.query.plant_id + `'`;
        }
       

        if (req.query.orderBy && req.query.orderBy != "") {
            if (req.query.order && req.query.order != "") {
                orderBy = {
                    by: req.query.orderBy,
                    order: req.query.order
                };
            } else {
                orderBy = {
                    by: 'u.' + req.query.orderBy,
                    order: "DESC"
                };
            }
        }

        req.query.searchOptions = {
            tAlias: 'u',
            exactMatch: req.query.filter == 'status' ? true : false
        }
        let joins = [{
            type: "LEFT",
            table: "plant p ",
            on: "u.plant_id = p.plant_id"
        }
        ];
        let options = {
            req: req,
            columns: columns,
            from:  dbTable + tableAlias,
            conditions: conditions,
            orderBy: orderBy,
            joins:joins,
            limit: { start: ((req.query.page - 1) * req.query.limit) || 0, limit: req.query.limit || 10 }
        }

        db.select(options, function(err, result) {
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
    } catch (error) {
        return callback(error);
    }
}



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////// get api of unapproved users
function unapprovedusers(req, callback) {
    try {
        let conditions = " u.is_approved = 0";
        let sql = "";
        let columns = `u.*`;
        // console.log('AB--------------------------------CD', global.user.testtaker_id);

        let orderBy = {
            by: " u.user_id",
            order: "DESC"
        };


        if (req.query.fromDate) {
            conditions += ` AND  DATE(created_at) >= '` + req.query.fromDate + `'`;
        }

        if (req.query.toDate) {
            conditions += ` AND  DATE(created_at) <= '` + req.query.toDate + `'`;
        }


      

        if (req.query.user_name) {
            conditions += ` AND u.user_name = '` + req.query.user_name + `'`;
        }
       

        if (req.query.orderBy && req.query.orderBy != "") {
            if (req.query.order && req.query.order != "") {
                orderBy = {
                    by: req.query.orderBy,
                    order: req.query.order
                };
            } else {
                orderBy = {
                    by: 'u.' + req.query.orderBy,
                    order: "DESC"
                };
            }
        }

        req.query.searchOptions = {
            tAlias: 'u',
            exactMatch: req.query.filter == 'status' ? true : false
        }
      

        let options = {
            req: req,
            columns: columns,
            from:  dbTable + tableAlias,
            conditions: conditions,
            orderBy: orderBy,
            limit: { start: ((req.query.page - 1) * req.query.limit) || 0, limit: req.query.limit || 10 }
        }

        db.select(options, function(err, result) {
            if (err) {
                return callback(err);
            } else {
                try {
                    // console.log("result",result.rows[0]);
                    callback(null, result);
                } catch (error) {
                    return callback(error);
                }
            }
        });
    } catch (error) {
        return callback(error);
    }
}



////// get api of unapproved users
function count(req, callback) {
    try {
        let sql = "";
        let columns = `(SELECT COUNT(user_id) from users where type = 'supervisor' and is_approved=1) as no_of_supervisors,
                        (SELECT COUNT(user_id) from users where type = 'operator' and is_approved=1) as no_of_operators,
                        (SELECT COUNT(user_id) from users where type = 'PLANT_ADMIN' and is_approved=1) as no_of_plant_admins,
                        (SELECT COUNT(user_id) from users where is_approved=1 AND type != 'PANASONIC_ADMIN' and type != 'PLANT_ADMIN') as total_users`;
     
        let options = {
            req: req,
            columns: columns,
            from:  dbTable + tableAlias
        }

        db.select(options, function(err, result) {
            if (err) {
                return callback(err);
            } else {
                try {
                    console.log("result-------------------------------",result[2].rows[0]);
                    callback(null, result[2].rows[0]);
                } catch (error) {
                    return callback(error);
                }
            }
        });
    } catch (error) {
        return callback(error);
    }
}
//////// get by id api of user table
function getById(req, callback) {

    try {
        let columns = `u.*`;
        let options = {
            id: req.params.id,
            from: dbTable + tableAlias,
            conditions: " user_id = " + req.params.id,
            columns: columns
        }
        db.select(options, function(err, result) {
            if (err) {
                return callback(err);
            } else {
                try {
                    console.log("in getById else block",result.rows)

                    // let i = 0;
                    // result[2].forEach(ele => {
                        // console.log("In For Each------"+JSON.stringify(ele));
                        // console.log("Logo Length-------"+ele.logo);

                        if (result.rows[0].image_url != null && result.rows[0].image_url  != '') {
                            result.rows[0].image_url  = s3url1.url(result.rows[0].image_url );
                            // callback(null, result.rows);

                        }
                            callback(null, result.rows);

                        
                        // if (result[2].length - 1 == i) {
                        //     callback(null, result);
                        // }
                        // i = i + 1;
                    // });
                } catch (error) {
                    return callback(error);
                }
            }
        });
    } catch (error) {
        return callback(error);
    }
}
//////// get by id api of user table
function plantDashboardCount(req, callback) {

    try {
        let columns = `
                       COUNT(Distinct gateway_id) as no_of_gateways`;
        let options = {
            id: req.query.plant_id,

            from: 'machine',
            conditions: " gateway_id is not null AND plant_id =  " + req.query.plant_id,
            columns: columns
        }
        db.select(options, function(err, result) {
            if (err) {
                return callback(err);
            } else {
                try {
                    console.log("in getById else block",result)
                    callback(null, result.rows);
                } catch (error) {
                    return callback(error);
                }
            }
        });
    } catch (error) {
        return callback(error);
    }
}

////////////////////////////add api of user table
function add(req, callback) {
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
                    try {
                        console.log('ADDING', result);
                        callback(null, result);
                    } catch (error) {
                        return callback(error);
                    }
                }
            });
     
    } catch (error) {
        return callback(error);
    }
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//update data in user table 
function edit(req, callback) {
    try {
        let columns1 = `u.*`;
        let options1 = {
            id: req.params.id,
            from: dbTable + tableAlias,
            conditions: " user_id = " + req.params.id,
            columns: columns1
        }
        db.select(options1, function(err, result) {
            if (err) {
                return callback(err);
            } else {
                console.log("RESULT is ",result);
                if(req.body.is_approved == 1){
                    console.log("IN APPROVE CASE");
                    
                    mailerTemp.approval(result.rows[0], function(err, Xresult) {
                        if (err) {
                            return callback(_error(err));
                        } else {
                            console.log('XRESULT', Xresult);
                            mail = Xresult;
                            console.log("AP-", mail);

                            let opt = {
                                subject: "Smart Factory Portal",
                                html: true,
                                data: mail,
                                to: result.rows[0].email
                            }
                            console.log("QRQRQR--------" + JSON.stringify(opt));
        
                            mailer.sendSesEmail(opt, function(eError, eResult) {
                                if (eError) {
                                    res.status(rs.resCodes.error.code).json(rs.errRes(_error(eError)));
                                } else {
                                    // _error(eError);
                                    console.log('mail sent successfully');
                                }
                            });
                        }
                    });
                }else if(req.body.is_approved != 1){
                mailerTemp.reject(result.rows[0], function(err, Xresult) {
                    if (err) {
                        return callback(_error(err));
                    } else {
                        console.log('XRESULT', Xresult);
                        mail = Xresult;
                        console.log("AP-", mail);
        
                        let opt = {
                            subject: "Smart Factory Portal",
                            html: true,
                            data: mail,
                            to: result.rows[0].email
                        }
                        console.log("QRQRQR--------" + JSON.stringify(opt));
        
                        mailer.sendSesEmail(opt, function(eError, eResult) {
                            if (eError) {
                                res.status(rs.resCodes.error.code).json(rs.errRes(_error(eError)));
                            } else {
                                // _error(eError);
                                console.log('mail sent successfully');
                            }
                        });
                    }
                });
            }
            }
        });
       
        if(req.body.is_approved == 1){
            try {
                console.log("IN APRROVAL CASE ");
            
                let sql = " SELECT * FROM users WHERE user_id = '"+ req.params.id+"' ";
                db.query(sql, function(uerr, uresult) {
                    if (uerr) {
                        res.status(rs.resCodes.error.code).json(rs.errRes(uerr));
                    } else {
                        console.log("IN RESULT--------------",uresult.rows);
                        console.log("C");
                        
                        var options = {
                            uri: ''+global.secret.WSO2_HOST+'/v1/smart-factory/sfUserManagement/approveUserRole',
                            method: 'POST',
                            // headers: {
                            //     "Authorization": "Basic UmFrZXNoOnBhc3N3b3Jk"
                            // },
                            json: {
                                
                                    "email": uresult.rows[0].email,
                                    "id": uresult.rows[0].wso2_id,
                                    "role": uresult.rows[0].type,
                                    "plantID": req.body.plant_id
                                
                            }
                        };
                        console.log("Before this");
        
                        console.log(typeof(options),"Checking Patch Params", JSON.stringify(options));
                        console.log("After this");
                        request(options, function (error, response) {
                            if (error) {
                                console.log("Cannot Communicate with WSO2");
                            }
                            else {
                                console.log("In Response ------", response.body);
                                // callback(null, response);
                                console.log('Send Successfully');
                            }
                        });
                    }
                });
            } catch (error) {
                return callback(error);
                
            }
         

        }
        let data = req.body;
        let delim = "";
        let setValues = "";
        let conditions = "user_id = " + req.params.id;

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
        db.update(options, function(err, result) {
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
    } catch (error) {
        return callback(error);

    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////remove api of  user table 

function remove(req, callback) {
    try {
        let conditions = " user_id = " + req.params.id;

        let options = {
            table: dbTable,
            conditions: conditions
        }
        db.remove(options, function(err, result) {
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
    } catch (error) {
        return callback(error);
    }
}
/////////////////////////
//for checking if server is running or not
function check(req, callback) {
    try {
       console.log("hello you ");
       let abcd = "hello world";
       return callback(null,abcd)
    } catch (error) {
        return callback(error);
    }
}


module.exports = {
    get: get,
    getById: getById,
    add: add,
    edit: edit,
    remove: remove,
    unapprovedusers:unapprovedusers,
    plantDashboardCount,
    count
}