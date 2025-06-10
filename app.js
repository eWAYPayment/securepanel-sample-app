const express = require('express');
const app = express();
const path = require('path');
const cors = require("cors");
const bodyParser = require('body-parser');
const config = require('config');
app.set('view engine', 'ejs');

require('dotenv').config();

const port = config.port || 3000;
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use((req, res, next) =>{
    req.header('Aceess-Control-Allow-Origin', '*');
    req.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    req.header('Access-Control-Allow-Credentials', true);
    req.header('Access-Control-Allow-Methods', 'Get, Post, Put, Patch');
    next();
});

global.xApiKey = config.xApiKey;

const indexRouter = require('./Routes/indexRouter');
app.use(indexRouter);

const shoppingCartRouter = require('./Routes/shoppingCartRouter');
app.use(shoppingCartRouter);


app.listen(port, function() {
    console.log(`listening on port ${port}!`);
});

module.exports = app;