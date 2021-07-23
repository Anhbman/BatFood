const siteRouter = require('./site');
const foodRouter = require('./foods');
const revenueRouter = require('./revenue');
const manageRouter = require('./manage');
const loginRouter = require('./login');
const jwt = require('jsonwebtoken');
const auth = require('../middlewares/auth');


function route(app) {

    app.use('/login',loginRouter);
    app.use('/',auth ,siteRouter);
    app.use('/foods',foodRouter);
    app.use('/revenue', revenueRouter);
    app.use('/manage', manageRouter);
}

module.exports = route;