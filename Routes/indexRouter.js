const express = require('express')
const indexRouter = express.Router();

const indexController = require('../controller/indexController');

indexRouter.get('/', indexController.renderIndex);

module.exports = indexRouter