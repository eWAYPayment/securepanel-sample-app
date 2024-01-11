const express = require('express')
const shoppingCartRouter = express.Router();

const shoppingCartController = require('../controller/shoppingCartController');

shoppingCartRouter.get('/shoppingCart', shoppingCartController.renderShoppingCart);
shoppingCartRouter.post('/createTransaction', shoppingCartController.createTransaction);

module.exports = shoppingCartRouter