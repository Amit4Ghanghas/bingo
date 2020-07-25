const express = require('express');
const user = require('../models/user');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const db = require('../utilities/sqlMapper');




var postreqParams = [
    { name: "fullName", type: "string", in: "formData", required: true },
    { name: "email", type: "string", in: "formData", required: true },
    { name: "wso2Id", type: "string", in: "formData", required: true },
    { name: "plant_id", type: "integer", in: "formData", required: true },
    { name: "role", type: "string", in: "formData", required: true },
    { name: "password", type: "string", in: "formData", required: true },
    { name: "accesstoken", required: false, in: "header", type: "string" }

];


var putreqParams = [{ name: "id", type: "integer", in: "path", required: true },
    { name: "user_name", required: true, in: "formData", type: "string" },
    { name: "accesstoken", required: false, in: "header", type: "string" }

];

//get api of user


let getparams = { api: "/user", method: "get", summary: "Fetch all users", tags: "user" };
getparams.parameters = [
    { name: "filter", required: false, in: "query", type: "string" },
    { name: "search", required: false, in: "query", type: "string" },
    { name: "page", required: true, in: "query", type: "integer" },
    { name: "limit", required: true, in: "query", type: "integer" },
    { name: "plant_id", required: false, in: "query", type: "integer" },
    { name: "is_approved", required: false, in: "query", type: "integer" },
    { name: "role", required: false, in: "query", type: "string" },
    { name: "accesstoken", required: false, in: "header", type: "string" }


];
sw.swaggerPaths(getparams);

router.get('/', [
    check('page', 'page should be an integer').optional().isInt(),
    check('limit', 'limit should be an integer').optional().isInt(),
    check('order', 'Wrong order Type').optional().isIn(['ASC', 'DESC']),

    check('orderBy', 'Invalid orderby').optional().custom(value => {
        if (!value.match(/^\s*[a-zA-Z]([a-z_A-Z]*[a-zA-Z]\s*)?$/)) return false;

        return true;
    }),
    check('filter', 'Invalid search').optional().custom(value => {
        if (!value.match(/^\s*[a-z]([a-z_]*[a-z]\s*)?([,]\s*[a-z]([a-z_]*[a-z]\s*)?)*$/)) return false;

        return true;
    }),
    check('search', 'Invalid search').optional().custom(value => {
        if (!value.match(/^[^,;]*$/)) return false;

        return true;
    })
], (req, res, next) => {
    const errors = validationResult(req);
    console.log("Error in auth---------" + JSON.stringify(errors));

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    console.log('step-1');
    user.get(req, function(err, result) {
        console.log('result',result);
        if (err) {
            if (err.sql) {
                delete err.sql;
            }
            if (err.sqlMessage) {
                delete err.sqlMessage;
            }
            if (err.sqlState) {
                delete err.sqlState;
            }
            res.status(rs.resCodes.error.code).json(rs.errRes(err));
        } else {
                // res.status(200).json(result);
            res.status(rs.resCodes[req.method].code).json(rs.successRes(result));
        }
    });
});



//get api of unapproved users

let getunapprovedparams = { api: "/user/unapproved", method: "get", summary: "Fetch all users", tags: "user" };
getunapprovedparams.parameters = [
    { name: "filter", required: false, in: "query", type: "string" },
    { name: "search", required: false, in: "query", type: "string" },
    { name: "page", required: true, in: "query", type: "integer" },
    { name: "limit", required: true, in: "query", type: "integer" },
    { name: "accesstoken", required: false, in: "header", type: "string" }

];
sw.swaggerPaths(getunapprovedparams);

router.get('/unapproved/', [
    check('page', 'page should be an integer').optional().isInt(),
    check('limit', 'limit should be an integer').optional().isInt(),
    check('order', 'Wrong order Type').optional().isIn(['ASC', 'DESC']),

    check('orderBy', 'Invalid orderby').optional().custom(value => {
        if (!value.match(/^\s*[a-zA-Z]([a-z_A-Z]*[a-zA-Z]\s*)?$/)) return false;

        return true;
    }),
    check('filter', 'Invalid search').optional().custom(value => {
        if (!value.match(/^\s*[a-z]([a-z_]*[a-z]\s*)?([,]\s*[a-z]([a-z_]*[a-z]\s*)?)*$/)) return false;

        return true;
    }),
    check('search', 'Invalid search').optional().custom(value => {
        if (!value.match(/^[^,;]*$/)) return false;

        return true;
    })
],(req, res, next) => {
    const errors = validationResult(req);
    console.log("Error in auth---------" + JSON.stringify(errors));

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    console.log('step-1');
    user.unapprovedusers(req, function(err, result) {
        console.log('result',result);
        if (err) {
            if (err.sql) {
                delete err.sql;
            }
            if (err.sqlMessage) {
                delete err.sqlMessage;
            }
            if (err.sqlState) {
                delete err.sqlState;
            }
            res.status(rs.resCodes.error.code).json(rs.errRes(err));
        } else {
                // res.status(200).json(result);
            res.status(rs.resCodes[req.method].code).json(rs.successRes(result));
        }
    });
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//search API

getparams.api = "/user/search";
getparams.method = "post";
getparams.parameters.push({ name: "advanceSearch", required: false, in: "formData", type: "object" },
{ name: "accesstoken", required: false, in: "header", type: "string" }
);
sw.swaggerPaths(getparams);
router.post('/search', [
    check('page', 'page should be an integer').optional().isInt(),
    check('limit', 'limit should be an integer').optional().isInt(),
    check('order', 'Wrong order Type').optional().isIn(['ASC', 'DESC']),

    check('orderBy', 'Invalid orderby').optional().custom(value => {
        if (!value.match(/^\s*[a-zA-Z]([a-z_A-Z]*[a-zA-Z]\s*)?$/)) return false;

        return true;
    }),
    check('filter', 'Invalid search').optional().custom(value => {
        if (!value.match(/^\s*[a-z]([a-z_]*[a-z]\s*)?([,]\s*[a-z]([a-z_]*[a-z]\s*)?)*$/)) return false;

        return true;
    }),
    check('search', 'Invalid search').optional().custom(value => {
        if (!value.match(/^[^,;]*$/)) return false;

        return true;
    })
],(req, res, next) => {
    const errors = validationResult(req);
    console.log("Error in auth---------" + JSON.stringify(errors));

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    user.get(req, function(err, result) {
        if (err) {
            if (err.sql) {
                delete err.sql;
            }
            if (err.sqlMessage) {
                delete err.sqlMessage;
            }
            if (err.sqlState) {
                delete err.sqlState;
            }
            res.status(rs.resCodes.error.code).json(rs.errRes(err));
        } else {
            res.status(rs.resCodes[req.method].code).json(rs.successRes(result));
        }
    });
});

//count api of user
let paramscount = { api: "/user/Count", method: "get", summary: "Fetch user count", tags: "user" };
paramscount.parameters = [
    { name: "plant_id", required: false, in: "query", type: "integer" },
{ name: "accesstoken", required: false, in: "header", type: "string" }

];
sw.swaggerPaths(paramscount);

router.get('/Count/', [

    check('plant_id', 'plant_id should be an integer').optional().isInt(),

], (req, res, next) => {
    const errors = validationResult(req);
    console.log("Error in auth---------" + JSON.stringify(errors));

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    console.log("COUNT API-------------------------------------------------------IN USER");
    user.count(req, function(err, result) {
        if (err) {
            if (err.sql) {
                delete err.sql;
            }
            if (err.sqlMessage) {
                delete err.sqlMessage;
            }
            if (err.sqlState) {
                delete err.sqlState;
            }
            res.status(rs.resCodes.error.code).json(rs.errRes(err));
        } else {
            res.status(rs.resCodes[req.method].code).json(result);
        }
    });
});

//getbyid api of user
let params = { api: "/user/{id}", method: "get", summary: "Fetch user details by id", tags: "user" };
params.parameters = [{ name: "id", required: true, in: "path", type: "integer" },
{ name: "accesstoken", required: false, in: "header", type: "string" }

];
sw.swaggerPaths(params);

router.get('/:id', [

    check('id', 'id should be an integer').isInt(),

], (req, res, next) => {
    const errors = validationResult(req);
    console.log("Error in auth---------" + JSON.stringify(errors));

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    user.getById(req, function(err, result) {
        if (err) {
            if (err.sql) {
                delete err.sql;
            }
            if (err.sqlMessage) {
                delete err.sqlMessage;
            }
            if (err.sqlState) {
                delete err.sqlState;
            }
            res.status(rs.resCodes.error.code).json(rs.errRes(err));
        } else {
            console.log("-------------controller getbyId-------", result.rows)
            res.status(rs.resCodes[req.method].code).json(rs.successObjRes(result));
        }
    });
});

//////////////////////////////////


//approve/ user
let params2 = { api: "/user/approve/{id}", method: "put", summary: "Fetch user details by id", tags: "user" };
params2.parameters = [{ name: "id", required: true, in: "path", type: "integer" },
{ name: "is_approved", required: true, in: "formData", type: "integer" },
{ name: "plant_id", required: true, in: "formData", type: "integer" },
{ name: "type", required: false, in: "formData", type: "string" },
{ name: "accesstoken", required: false, in: "header", type: "string" }


];
sw.swaggerPaths(params2);

router.put('/approve/:id', [

    check('id', 'id should be an integer').isInt(),
    check('is_approved', 'is_approved should be an integer').isInt().isIn([1, -1]),
    check('type', 'Wrong User Type').isIn(['operator', 'supervisor']).optional(),
    check('plant_id', 'id should be an integer').isInt().optional(),



], (req, res, next) => {
    const errors = validationResult(req);
    console.log("Error in auth---------" + JSON.stringify(errors));

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
        user.edit(req, function(err, result) {
            if (err) {
                if (err.sql) {
                    delete err.sql;
                }
                if (err.sqlMessage) {
                    delete err.sqlMessage;
                }
                if (err.sqlState) {
                    delete err.sqlState;
                }
                res.status(rs.resCodes.error.code).json(rs.errRes(err));
            } else {
                console.log("-------------controller getbyId-------", result.rows)
                
                res.status(rs.resCodes[req.method].code).json(rs.successObjRes(result));
            }
        });
   
});
///////////////////////////////
//post api of tenet user
// let postparams = { api: "/user/plantAdmin", method: "post", summary: "Add a new tenetadmin", tags: "user" };
// postparams.parameters = postreqParams;
// sw.swaggerPaths(postparams);
router.post('/plantAdmin/', (req, res, next) => {

    req.body.is_approved = 1;
    req.body.is_active = true;
    req.body.name = req.body.fullName;
    req.body.type = req.body.role;
    req.body.wso2_id = req.body.wso2Id;
    req.body.plant_id = req.body.plantID;

    plantID
    user.add(req, function(err, result) {
        console.log('error', err);
        if (err) {
            if (err.sql) {
                delete err.sql;
            }
            if (err.sqlMessage) {
                delete err.sqlMessage;
            }
            if (err.sqlState) {
                delete err.sqlState;
            }
            res.status(rs.resCodes.error.code).json(rs.errRes(err));
        }else {
            let result = {message:"Plant Admin added Sucessfully"}
                    res.status(rs.resCodes[req.method].code).json(result);
                }
            
    });
});

//put api of user
let putparams = { api: "/user/{id}", method: "put", summary: " edit user", tags: "user" };
putparams.parameters = putreqParams;
sw.swaggerPaths(putparams);



router.put('/:id',[

    check('id', 'id should be an integer').isInt(),

], (req, res, next) => {
    const errors = validationResult(req);
    console.log("Error in auth---------" + JSON.stringify(errors));

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    user.edit(req, function(err, result) {
        if (err) {
            if (err.sql) {
                delete err.sql;
            }
            if (err.sqlMessage) {
                delete err.sqlMessage;
            }
            if (err.sqlState) {
                delete err.sqlState;
            }
            res.status(rs.resCodes.error.code).json(rs.errRes(err));
        } else {
            res.status(rs.resCodes[req.method].code).json(rs.successObjRes(result));
        }
    });
});


//////////////////////////////////////////
//delete api of user
let delparams = { api: "/user/{id}", method: "delete", summary: " delete user", tags: "user" };
delparams.parameters = [{ name: "id", required: true, in: "path", type: "integer" },
{ name: "accesstoken", required: false, in: "header", type: "string" }

];
sw.swaggerPaths(delparams);


router.delete('/:id', [

    check('id', 'id should be an integer').isInt(),

], (req, res, next) => {
    const errors = validationResult(req);
    console.log("Error in auth---------" + JSON.stringify(errors));

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    user.remove(req, function(err, result) {
        if (err) {
            if (err.sql) {
                delete err.sql;
            }
            if (err.sqlMessage) {
                delete err.sqlMessage;
            }
            if (err.sqlState) {
                delete err.sqlState;
            }
            res.status(rs.resCodes.error.code).json(rs.errRes(err));
        } else {
            res.status(rs.resCodes[req.method].code).json(rs.successObjRes(result));
        }
    });
});



module.exports = router;