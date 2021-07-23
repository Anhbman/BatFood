const db = require('../../config/db/index');
const models = require('../models/Models');

class SiteController{
    
    show(req, res){
        models.monan.findAll()
          .then( result => {
            var foods = result.map((currentValue) => {
                      return currentValue;
                    });
            res.render('home',{foods});
          })
          .catch(err => console.log('Error storedfood: ' + err));
    }
}

module.exports = new SiteController;