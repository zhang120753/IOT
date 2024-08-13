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
    var sql_ip = $sql.card.select_ip;
    sql_ip += " where usernm ='" + username + "'"
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


router.post('/knowcard', (req, res) => {
    wk.exec("nmap --iflist", function (err, stdout) {//查看本地主机的接口信息和路由信息
        if (err) {
            console.error(err)
        }
        a = stdout.split('\n')

        result = [];
        for (var i = 3; i < a.length; i++) {
            var item = a[i];
            if (item == '\r') {
                break;
            }
            var list1 = item.split(' ');
            var list = [];
            for (var j = 0; j < list1.length; j++) {
                if (list1[j] == '') continue;
                list.push(list1[j])
            }
            result.push({
                dev: list[0],
                short: list[1],
                ip: list[2],
                type: list[3],
                up: list[4],
                mtu: list[5],
                mac: list[6]
            })
        }
        console.log(result)
        res.send(result)
    })

})

router.post('/searchall', (req, res) => {
    var cardid = req.body.cardid;
    var ip = req.body.ip;
    var usernm = req.body.username;
    console.log(cardid)
    console.log(ip)

    var op = '-e ' + cardid;
    const opts = {
        flags: [
            op,
        ],
        range: [
            ip,
            'd:/Nmap',
        ],
    };
    var ipv4 = "";
    var port_num = "";
    var pc_proto = "";
    var pc_state = "";
    var pc_service = "";
    var pc_vendor = "";
    var mac = "";
    var i = 0;
    var result = [];

    nmap.scan(opts, function (err, report) {
        if (err) throw new Error(err);
        for (var item in report) {
            for (var host in report[item].host) {
                for (var ports in report[item].host[host].ports) {
                    ipv4 = report[item].host[host].address[0].item.addr;
                    console.log(ipv4);
                    mac = report[item].host[host].address[1].item.addr;
                    pc_vendor = report[item].host[host].address[1].item.vendor;

                    if (report[item].host[host].ports[ports].port) {
                        for (var port in report[item].host[host].ports[ports].port) {
                            if (report[item].host[host].ports[ports].port[port].state[0].item.state == 'open' | 'filtered') {

                                pc_state = report[item].host[host].ports[ports].port[port].state[0].item.state;
                                pc_proto = report[item].host[host].ports[ports].port[port].item.protocol;
                                port_num = report[item].host[host].ports[ports].port[port].item.portid;
                                pc_service = report[item].host[host].ports[ports].port[port].service[0].item.name;

                                result[i] = [];
                                result[i] = {
                                    ipv4: ipv4,
                                    mac: mac,
                                    port_num: port_num,
                                    pc_proto: pc_proto,
                                    pc_service: pc_service,
                                    pc_state: pc_state,
                                    pc_vendor: pc_vendor,
                                }
                                if (result[i].data == 0) {
                                    delete result[i];
                                    i--;
                                }
                                i++;
                            }
                        }
                    } else {
                        result[i] = [];
                        result[i] = {
                            ipv4: ipv4,
                            mac: mac,
                            port_num: port_num,
                            pc_proto: pc_proto,
                            pc_service: pc_service,
                            pc_state: pc_state,
                            pc_vendor: pc_vendor,
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
        console.log(result);
        res.send(result);

        var sql = $sql.card.add
        for (i = 0; i < result.length; i++) {
            conn.query(sql, [usernm, result[i].ipv4, result[i].mac, result[i].port_num, result[i].pc_proto, result[i].pc_service, result[i].pc_state, result[i].pc_vendor], function (err, res) {
                if (err) {
                    return console.log(err);
                }
                if (res) {
                    jsonWrite(res, res);
                }
            })
        }
    })
});

module.exports = router;