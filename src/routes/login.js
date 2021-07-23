const express = require('express');
const route = express.Router();

const loginController = require('../app/controller/LoginController');

route.get('/', loginController.showLogin);
route.post('/', loginController.show)

module.exports = route;