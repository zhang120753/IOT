const bodyParser = require('body-parser');
var express = require('express');
var router = express.Router();
var nmap = require('libnmap');
var wk = require("child_process");
var mysql = require('mysql');
var models = require('../db/db');
var $sql = require('../db/sqlMap');

var conn = mysql.createConnection(models.mysql);

conn.connect();

var jsonWrite = function (res, ret) {
    if (typeof ret === 'undefined') {
        return res.send('err');
    } else {
        return console.log(ret);
    }
}

router.post('/history', (req, res) => {
    var ip = req.body.ip;
    var username = req.body.username;
    console.log(ip);
    var sql_ip = $sql.bug.select_ip;
    if (ip) {
        sql_ip += " where ip ='" + ip + "' and user='" + username + "'"
        console.log(sql_ip)
    }
    conn.query(sql_ip, function (err, result) {
        if (err) {
            console.log(err);
        }
        if (result[0] === undefined) {
            res.end('-1')
        } else {
            // json(res,result);
            res.end(JSON.stringify(result));
        }
    })
})


router.post('/searchbug', (req, res) => {
    var ip = req.body.ip;
    var user = req.body.user;
    var op = '--script=vuln'
    console.log(ip);
    const opts = {
        flags: [
            op,
        ],
        range: [
            ip,
            'd:/Nmap',
        ],
    };
    var name = "";
    var status = "";
    var result = [];
    var i = 0;
    nmap.scan(opts, function (err, report) {
        if (err) throw new Error(err);
        for (var item in report) {
            for (var host in report[item].host) {
                for (var hostscript in report[item].host[host].hostscript) {
                    for (var script in report[item].host[host].hostscript[hostscript].script) {
                        name = report[item].host[host].hostscript[hostscript].script[script].item.id;
                        status = report[item].host[host].hostscript[hostscript].script[script].item.output;
                        result[i] = {
                            name: name,
                            status: status
                        }
                        i++;
                    }
                }
            } break;
        }
        console.log(result);
        res.send(result);

        var sql = $sql.bug.add
        for (i = 0; i < result.length; i++) {
            conn.query(sql, [user, ip, result[i].name, result[i].status], function (err, res) {
                if (err) {
                    return console.log(err);
                }
                if (res) {
                    jsonWrite(res, res);
                }
            })
        }
    });
})
module.exports = router;