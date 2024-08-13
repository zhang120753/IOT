const bodyParser = require('body-parser');
var express = require('express');
const { readlink } = require('fs');
var router = express.Router();
var nmap = require('libnmap');
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
    var op = req.body.op;
    var username = req.body.username;
    console.log(ip);
    console.log(op);
    if (op == '-sS') {
        var sql_ip = $sql.search.select_ip;
        if (ip) {
            sql_ip += " where ip ='" + ip + "' and username='" + username + "' and command='" + op + "'"
            console.log(sql_ip)
        }
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
    }
    if (op == '-sU') {
        var sql_ip = $sql.search.select_ip;
        if (ip) {
            sql_ip += " where ip ='" + ip + "' and username='" + username + "' and command='" + op + "'"
            console.log(sql_ip)
        }
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
    }
    if (op == '-sT') {
        var sql_ip = $sql.search.select_ip;
        if (ip) {
            sql_ip += " where ip ='" + ip + "' and username='" + username + "' and command='" + op + "'"
            console.log(sql_ip)
        }
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
    }
    if (op == '-sA') {
        var sql_ip = $sql.search.select_ip;
        if (ip) {
            sql_ip += " where ip ='" + ip + "' and username='" + username + "' and command='" + op + "'"
            console.log(sql_ip)
        }
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
    }
    if (op == '-sV') {
        var sql_ip = $sql.search.select_ip;
        if (ip) {
            sql_ip += " where ip ='" + ip + "' and username='" + username + "' and command='" + op + "'"
            console.log(sql_ip)
        }
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
    }
    if (op == '-v') {
        var sql_ip = $sql.search.select_ip;
        if (ip) {
            sql_ip += " where ip ='" + ip + "' and username='" + username + "' and command='" + op + "'"
            console.log(sql_ip)
        }
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
    }
    if (op == '-O') {
        var sql_ip = $sql.search.select_ip;
        if (ip) {
            sql_ip += " where ip ='" + ip + "' and username='" + username + "' and command='" + op + "'"
            console.log(sql_ip)
        }
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
    }
})



router.post('/searchparam', (req, res) => {
    var ip = req.body.ip;
    var op = req.body.op;
    var username = req.body.username;
    console.log(ip);
    console.log(op);

    const opts = {
        flags: [
            op,
        ],
        range: [
            ip,
            'd:/Nmap',
        ]
    };

    var result = [];

    var port_num = "";
    var pc_status = "";
    var pc_proto = "";
    var pc_state = "";
    var pc_service = "";
    var pc_product = "";
    var pc_cpe = "";
    var pc_os = "";
    var ipp = "";
    var i = 0;
    var j = 0;
    var command = "";

    if (op == '-sS') {
        command = '-sS';

        nmap.scan(opts, function (err, report) {

            if (err) throw new Error(err);

            for (var item in report) {
                for (var host in report[item].host) {
                    for (var ports in report[item].host[host].ports) {
                        pc_status = 'up';
                        ip_num = report[item].host[host].address[0].item.addr;
                        if (ip_num == ipp) break;
                        if (ip_num == ip) {
                            ipp = ip_num;
                            for (var port in report[item].host[host].ports[ports].port) {
                                pc_state = report[item].host[host].ports[ports].port[port].state[0].item.state;
                                pc_proto = report[item].host[host].ports[ports].port[port].item.protocol;
                                port_num = report[item].host[host].ports[ports].port[port].item.portid;
                                pc_service = report[item].host[host].ports[ports].port[port].service[0].item.name;

                                result[i] = [];
                                result[i] = {
                                    pc_status: pc_status,
                                    port_num: port_num,
                                    pc_proto: pc_proto,
                                    pc_state: pc_state,
                                    pc_service: pc_service
                                }

                                if (result[i].data == 0) {
                                    delete result[i];
                                    i--;
                                }
                                i++;
                            }
                            // break;
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

    if (op == '-sU') {

        command = '-sU';
        nmap.scan(opts, function (err, report) {

            if (err) throw new Error(err);

            for (var item in report) {
                for (var host in report[item].host) {
                    for (var ports in report[item].host[host].ports) {
                        pc_status = 'up';
                        ip_num = report[item].host[host].address[0].item.addr;
                        if (ip_num == ipp) break;
                        if (ip_num == ip) {
                            ipp = ip_num;
                            for (var port in report[item].host[host].ports[ports].port) {
                                // if (report[item].host[host].ports[ports].port[port].state[0].item.state == 'open|filtered') {

                                pc_state = report[item].host[host].ports[ports].port[port].state[0].item.state;
                                console.log(pc_state);
                                pc_proto = report[item].host[host].ports[ports].port[port].item.protocol;
                                port_num = report[item].host[host].ports[ports].port[port].item.portid;
                                pc_service = report[item].host[host].ports[ports].port[port].service[0].item.name;


                                result[i] = [];
                                result[i] = {
                                    pc_status: pc_status,
                                    port_num: port_num,
                                    pc_proto: pc_proto,
                                    pc_state: pc_state,
                                    pc_service: pc_service
                                }
                                if (result[i].data == 0) {
                                    delete result[i];
                                    i--;
                                }
                                i++;
                            } break;
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

    if (op == '-sT') {
        command = '-sT';

        nmap.scan(opts, function (err, report) {

            if (err) throw new Error(err);

            for (var item in report) {
                for (var host in report[item].host) {
                    for (var ports in report[item].host[host].ports) {
                        pc_status = 'up';
                        ip_num = report[item].host[host].address[0].item.addr;
                        if (ip_num == ipp) break;
                        if (ip_num == ip) {
                            ipp = ip_num;
                            for (var port in report[item].host[host].ports[ports].port) {
                                // if (report[item].host[host].ports[ports].port[port].state[0].item.state == 'open') {
                                // pc_state = 'open';
                                pc_state = report[item].host[host].ports[ports].port[port].state[0].item.state;
                                pc_proto = report[item].host[host].ports[ports].port[port].item.protocol;
                                port_num = report[item].host[host].ports[ports].port[port].item.portid;
                                pc_service = report[item].host[host].ports[ports].port[port].service[0].item.name;


                                result[i] = [];
                                result[i] = {
                                    pc_status: pc_status,
                                    port_num: port_num,
                                    pc_proto: pc_proto,
                                    pc_state: pc_state,
                                    pc_service: pc_service
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

    if (op == '-sA') {
        command = '-sA';

        nmap.scan(opts, function (err, report) {

            if (err) throw new Error(err);

            for (var item in report) {
                for (var host in report[item].host) {
                    for (var ports in report[item].host[host].ports) {
                        pc_status = 'up';
                        ip_num = report[item].host[host].address[0].item.addr;
                        if (ip_num == ipp) break;
                        if (ip_num == ip) {
                            ipp = ip_num
                            for (var port in report[item].host[host].ports[ports].port) {
                                if (report[item].host[host].ports[ports].port[port].state[0].item.state == 'filtered' || 'open') {
                                    pc_state = report[item].host[host].ports[ports].port[port].state[0].item.state;
                                    pc_proto = report[item].host[host].ports[ports].port[port].item.protocol;
                                    port_num = report[item].host[host].ports[ports].port[port].item.portid;
                                    pc_service = report[item].host[host].ports[ports].port[port].service[0].item.name;


                                    result[i] = [];
                                    result[i] = {
                                        pc_status: pc_status,
                                        port_num: port_num,
                                        pc_proto: pc_proto,
                                        pc_state: pc_state,
                                        pc_service: pc_service
                                    }
                                    if (result[i].data == 0) {
                                        delete result[i];
                                        i--;
                                    }
                                    i++;
                                }
                            };
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

    if (op == '-sV') {
        command = '-sV';

        nmap.scan(opts, function (err, report) {

            if (err) throw new Error(err);

            for (var item in report) {
                for (var host in report[item].host) {
                    for (var ports in report[item].host[host].ports) {
                        pc_status = 'up';
                        ip_num = report[item].host[host].address[0].item.addr;
                        if (ip_num == ipp) break;
                        if (ip_num == ip) {
                            ipp = ip_num
                            for (var port in report[item].host[host].ports[ports].port) {
                                if (report[item].host[host].ports[ports].port[port].state[0].item.state == 'filtered' || 'open') {

                                    pc_state = report[item].host[host].ports[ports].port[port].state[0].item.state;
                                    pc_proto = report[item].host[host].ports[ports].port[port].item.protocol;
                                    port_num = report[item].host[host].ports[ports].port[port].item.portid;
                                    pc_service = report[item].host[host].ports[ports].port[port].service[0].item.name;
                                    pc_product = report[item].host[host].ports[ports].port[port].service[0].item.product;

                                    pc_cpe = report[item].host[host].ports[ports].port[port].service[0].cpe;
                                    console.log(pc_cpe);

                                    result[i] = [];
                                    result[i] = {
                                        pc_status: pc_status,
                                        port_num: port_num,
                                        pc_proto: pc_proto,
                                        pc_state: pc_state,
                                        pc_service: pc_service,
                                        pc_product: pc_product,
                                        pc_cpe: pc_cpe
                                    }
                                    if (result[i].data == 0) {
                                        delete result[i];
                                        i--;
                                    }
                                    i++;
                                }
                            };
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

    if (op == '-v') {
        command = '-v';

        nmap.scan(opts, function (err, report) {

            if (err) throw new Error(err);

            for (var item in report) {
                for (var host in report[item].host) {
                    for (var ports in report[item].host[host].ports) {
                        pc_status = 'up';
                        ip_num = report[item].host[host].address[0].item.addr;
                        if (ip_num == ipp) break;
                        if (ip_num == ip) {
                            ipp = ip_num
                            for (var port in report[item].host[host].ports[ports].port) {
                                pc_state = report[item].host[host].ports[ports].port[port].state[0].item.state;
                                pc_proto = report[item].host[host].ports[ports].port[port].item.protocol;
                                port_num = report[item].host[host].ports[ports].port[port].item.portid;
                                pc_service = report[item].host[host].ports[ports].port[port].service[0].item.name;


                                result[i] = [];
                                result[i] = {
                                    pc_status: pc_status,
                                    port_num: port_num,
                                    pc_proto: pc_proto,
                                    pc_state: pc_state,
                                    pc_service: pc_service
                                }
                                if (result[i].data == 0) {
                                    delete result[i];
                                    i--;
                                }
                                i++;
                            };
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

    if (op == '-O') {
        command = '-O';
        var a = [];
        var b = [];
        var c = [];

        nmap.scan(opts, function (err, report) {

            if (err) throw new Error(err);

            for (var item in report) {
                for (var host in report[item].host) {
                    for (var os in report[item].host[host].os) {
                        console.log(report[item].host[host].os[os].portused);
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
                        pc_status = 'up';
                        ip_num = report[item].host[host].address[0].item.addr;
                        if (ip_num == ipp) break;
                        if (ip_num == ip) {
                            ipp = ip_num
                            for (var port in report[item].host[host].ports[ports].port) {
                                if (report[item].host[host].ports[ports].port[port].state[0].item.state == 'open') {
                                    pc_state = 'open';
                                    pc_proto = report[item].host[host].ports[ports].port[port].item.protocol;
                                    port_num = report[item].host[host].ports[ports].port[port].item.portid;
                                    pc_service = report[item].host[host].ports[ports].port[port].service[0].item.name;

                                    for (j = 0; j < a.length; j++) {
                                        if (port_num == a[j]) {
                                            console.log(port_num);
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
                                        pc_cpe: pc_cpe,
                                        pc_os: pc_os
                                    }
                                    if (result[i].data == 0) {
                                        delete result[i];
                                        i--;
                                    }
                                    i++;
                                }
                            };
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