const userApi = require('./api/userApi');
const nampApi = require('./api/nmapApi');
const optionApi = require('./api/optionApi');
const cardApi = require('./api/cardApi');
const liveApi = require('./api/liveApi.js')
const bugApi = require('./api/bugApi')
// const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const fileUpload = require('express-fileupload');
app.use(fileUpload());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded())

app.use('/api/user', userApi);
app.use('/api/nmap', nampApi);
app.use('/api/option', optionApi);
app.use('/api/card', cardApi);
app.use('/api/live', liveApi)
app.use('/api/bug', bugApi)

app.listen(3000);//监听端口
console.log('success listen at port: 3000')