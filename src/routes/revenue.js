const express = require('express');
const route = express.Router();

const revenueController = require('../app/controller/RevenueController');

route.get('/', revenueController.show)

module.exports = route;