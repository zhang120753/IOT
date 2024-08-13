var sqlMap = {
    user: {
        add: 'insert into user (username, password) values (?,?)',
        select_name: 'select * from user',
    },
    search: {
        add: 'insert into search (username,command,ip,status,port,protocol,state,service,product,cpe,os) values(?,?,?,?,?,?,?,?,?,?,?)',
        select_ip: 'select * from search'
    },
    card: {
        add: 'insert into card (usernm,ip,mac,port,protocol,service,state,vendor) values(?,?,?,?,?,?,?,?)',
        select_ip: 'select * from card'
    },
    live: {
        add: 'insert into live (usernme,ip,addr,mac,state,vendor) values(?,?,?,?,?,?)',
        select_ip: 'select * from live'
    },
    bug: {
        add: 'insert into bug (user,ip,name,status) values(?,?,?,?)',
        select_ip: 'select * from bug'
    },
}

module.exports = sqlMap;