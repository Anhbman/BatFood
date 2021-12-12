const jwt = require('jsonwebtoken');
const db = require('../../config/db/index');
const models = require('../models/Models');
const bcrypt = require('bcrypt');

class LoginController{

    showLogin(req, res){
        res.render('login/login');
    }

    show(req, res) {
        var user = req.body.username;
        var psw = req.body.password;

        var salt = bcrypt.genSaltSync(10);
        var pass_mahoa = bcrypt.hashSync(psw, salt);
        
        models.taikhoan.findOne({
            where:{
                user: user,
                //psw: pass_mahoa
            }
        })
            .then(result =>{
                if (result) {

                    var checkPass = result.psw;
                    var kq = bcrypt.compareSync(psw, checkPass);
                    if (kq){
                        var token = jwt.sign({
                            id: result.user
                        },process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_LIFE});
                        res.cookie('acc' ,token)
                        res.redirect('/');
                    }else
                        res.redirect('login');
                }else
                    res.redirect('login');
            })
            .catch(err => console.log('ERROR showAccount ' + err))
    }
}

module.exports = new LoginController;