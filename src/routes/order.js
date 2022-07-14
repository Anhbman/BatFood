const express = require('express');
const route = express.Router();

const orderController = require('../app/controller/OrderController');

route.get('/wait', orderController.waitOrder);
route.get('/:id', orderController.getDetailOrder);
route.get('/success/:id', orderController.successOrder);
route.get('/bill/:id', orderController.getDetailBill);
route.get('/bill/success/:id', orderController.successBill);

module.exports = route;