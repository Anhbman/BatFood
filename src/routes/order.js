const express = require('express');
const route = express.Router();

const orderController = require('../app/controller/OrderController');

route.get('/wait', orderController.waitOrder);

module.exports = route;