const jwt = require('jsonwebtoken');

function authenToken(req, res, next){
    
    const token = req.cookies.acc;

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
        if(err){
            console.log(err);
            res.redirect('login')
        }
        else if(data)
            next();
    });
}

module.exports = authenToken;