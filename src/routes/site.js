const express = require('express');
const route = express.Router();

const siteController = require('../app/controller/SiteController');


route.get('/home', siteController.show);

module.exports = route;