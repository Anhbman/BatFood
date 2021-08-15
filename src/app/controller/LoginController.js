const jwt = require('jsonwebtoken');
const db = require('../../config/db/index');
const models = require('../models/Models');

class LoginController{

    showLogin(req, res){
        res.render('login/login');
    }

    show(req, res) {
        var user = req.body.username;
        var psw = req.body.password;

        models.taikhoan.findOne({
            where:{
                user: user,
                psw: psw
            }
        })
            .then(result =>{
                if (result) {
                   var token = jwt.sign({
                       id: result.user
                    },process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_LIFE});
                    res.cookie('acc' ,token)
                    res.redirect('/');
                }else
                    res.redirect('login');
            })
            .catch(err => console.log('ERROR showAccount ' + err))
    }
}

module.exports = new LoginController;