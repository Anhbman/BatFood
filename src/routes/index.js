const siteRouter = require('./site');
const foodRouter = require('./foods');
const revenueRouter = require('./revenue');
const manageRouter = require('./manage');
const loginRouter = require('./login');
const orderRouter = require('./order');
const jwt = require('jsonwebtoken');
const auth = require('../middlewares/auth');


function route(app) {
    app.use('/login',loginRouter);
    app.use('/',auth ,siteRouter);
    app.use('/foods',auth ,foodRouter);
    app.use('/revenue',auth ,revenueRouter);
    app.use('/manage',auth ,manageRouter);
    app.use('/order', auth, orderRouter);
}

module.exports = route;