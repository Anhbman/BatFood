const express = require('express');
const route = express.Router();

const revenueController = require('../app/controller/RevenueController');

route.get('/:page', revenueController.show)

module.exports = route;