var models = require('../db/db');
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var $sql = require('../db/sqlMap');

var conn = mysql.createConnection(models.mysql);

conn.connect();

var jsonWrite = function (res, ret) {
    if (typeof ret === 'undefined') {
        res.send('err');
    } else {
        console.log(ret);
        res.send(ret);
    }
}

var dateStr = function (str) {
    return new Date(str.slice(0, 7));
}

//查找用户接口
router.post('/login', (req, res) => {
    var sql_name = $sql.user.select_name;
    var params = req.body;
    console.log(params);
    if (params.name) {
        sql_name += " where username ='" + params.name + "'";
        console.log(sql_name);
    }
    conn.query(sql_name, params.name, function (err, result) {
        if (err) {
            console.log(err);
        }
        console.log(result);
        if (result[0] === undefined) {
            res.send('-1')   //查询不出username，data 返回-1
        } else {
            var resultArray = result[0];
            console.log(resultArray.password);
            console.log(params.password);
            if (resultArray.password == params.password) {
                jsonWrite(res, result);
            } else {
                res.send('0')   //username
            }
        }
    })
});


module.exports = router;