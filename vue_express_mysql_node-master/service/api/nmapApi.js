const { json } = require('body-parser');
const bodyParser = require('body-parser');
var express = require('express');
var router = express.Router();
var nmap = require('libnmap');
var mysql = require('mysql');
var models = require('../db/db');
const { user } = require('../db/sqlMap');
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
    console.log(username);
    var sql_ip = $sql.search.select_ip;
    if (ip) {
        sql_ip += " where ip ='" + ip + "' and username='" + username + "'"
        console.log(sql_ip)
    }
    conn.query(sql_ip, function (err, result) {
        if (err) {
            console.log(err);
        }
        if (result[0] === undefined) {
            res.end('-1')
        } else {
            json(res, result);
            res.end(JSON.stringify(result));
        }
    })
})

router.post('/search', (req, res) => {
    var ip = req.body.ip;
    console.log(ip);
    var username = req.body.username;
    console.log(username);

    if (ip) {
        const opts = {
            flags: [
                '-A',
            ],
            range: [
                ip,
                'd:/Nmap',
            ]
        };
        nmap.scan(opts, function (err, report) {
            if (err) throw new Error(err);

            var result = [];
            var ip_num = "",

                port_num = "",
                pc_status = "",
                pc_proto = "",
                pc_state = "",
                pc_service = "",
                pc_product = "",
                pc_cpe = "",
                pc_os = "",
                j = 0,
                i = 0,
                ipp = "",
                command = '-A';
            var a = [];
            var b = [];
            var c = [];


            for (var item in report) {
                for (var host in report[item].host) {
                    pc_status = report[item].host[host].status[0].item.state;

                    for (var os in report[item].host[host].os) {
                        for (var portused in report[item].host[host].os[os].portused) {
                            if (report[item].host[host].os[os].portused[portused].item.state == 'open') {
                                a.push(report[item].host[host].os[os].portused[portused].item.portid);
                            }
                        }
                        for (var osmatch in report[item].host[host].os[os].osmatch) {
                            b.push(report[item].host[host].os[os].osmatch[osmatch].item.name);
                            pc_cpe = report[item].host[host].os[os].osmatch[osmatch].osclass[0].cpe;
                            c.push(pc_cpe);
                        }
                    }

                    for (var ports in report[item].host[host].ports) {
                        ip_num = report[item].host[host].address[0].item.addr;
                        if (ip_num == ipp) break;
                        if (ip == ip_num) {
                            ipp = ip_num;
                            console.log(ip_num);
                            for (var port in report[item].host[host].ports[ports].port) {
                                pc_state = report[item].host[host].ports[ports].port[port].state[0].item.state;
                                pc_proto = report[item].host[host].ports[ports].port[port].item.protocol;
                                port_num = report[item].host[host].ports[ports].port[port].item.portid;
                                pc_service = report[item].host[host].ports[ports].port[port].service[0].item.name;
                                pc_product = report[item].host[host].ports[ports].port[port].service[0].item.product;

                                for (j = 0; j < a.length; j++) {
                                    if (port_num == a[j]) {
                                        pc_cpe = c[j];
                                        pc_os = b[j];
                                    }
                                    else {
                                        pc_cpe = "";
                                        pc_os = "";
                                    }
                                }

                                result[i] = [];
                                result[i] = {
                                    pc_status: pc_status,
                                    port_num: port_num,
                                    pc_proto: pc_proto,
                                    pc_state: pc_state,
                                    pc_service: pc_service,
                                    pc_product: pc_product,
                                    pc_cpe: pc_cpe,
                                    pc_os: pc_os,
                                }
                                if (result[i].data == 0) {
                                    delete result[i];
                                    i--;
                                }
                                i++;
                            }
                        }
                    }
                }
            }
            console.log(result);
            res.send(result);
            var sql = $sql.search.add
            for (i = 0; i < result.length; i++) {
                conn.query(sql, [username, command, ip, result[i].pc_status, result[i].port_num, result[i].pc_proto, result[i].pc_state, result[i].pc_service, result[i].pc_product, result[i].pc_cpe, result[i].pc_os], function (err, res) {
                    if (err) {
                        return console.log(err);
                    }
                    if (res) {
                        jsonWrite(res, res);
                    }
                })
            }
        })
    }
})

module.exports = router;


