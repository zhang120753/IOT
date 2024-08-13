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
    var username = req.body.username;
    var sql_ip = $sql.live.select_ip;
    var ip = req.body.ip;
    sql_ip += " where usernme ='" + username + "' and ip='" + ip + "'"
    console.log(sql_ip)
    conn.query(sql_ip, function (err, result) {
        if (err) {
            console.log(err);
        }
        if (result[0] === undefined) {
            res.end('-1')
        } else {
            res.end(JSON.stringify(result));
        }
    })
})

router.post('/searchlive', (req, res) => {
    var ip = req.body.ip;
    console.log(ip)
    var usernme = req.body.username;
    var op = 'nmap -sP ' + ip
    console.log(op)
    wk.exec(op, function (err, stdout) {
        if (err) {
            console.error(err)
        }
        a = stdout.split('\n')
        var result = [];
        var addr = "";
        var mac = "";
        var state = "";
        var vendor = "";
        var j = 0;
        for (var i = 1; i <= a.length - 6; i += 3) {
            addr = a[i].substring(21, a[i].length - 1);

            mac = a[i + 2].substring(13, 31);

            state = a[i + 1].substring(8, 10)
            vendor = a[i + 2].substring(32, a[i + 2].length - 2)

            result[j] = {
                addr: addr,
                mac: mac,
                state: state,
                vendor: vendor
            }
            j++;
        }
        i = a.length - 4
        addr = a[i].substring(21, a[i].length - 1);
        state = a[i + 1].substring(8, 10);
        mac = '';
        vendor = '';
        result[j] = {
            addr: addr,
            mac: mac,
            state: state,
            vendor: vendor
        }
        console.log(result)
        res.send(result)

        var sql = $sql.live.add
        for (i = 0; i < result.length; i++) {
            conn.query(sql, [usernme, ip, result[i].addr, result[i].mac, result[i].state, result[i].vendor], function (err, res) {
                if (err) {
                    return console.log(err);
                }
                if (res) {
                    jsonWrite(res, res);
                }
            })
        }
    })

})
module.exports = router;