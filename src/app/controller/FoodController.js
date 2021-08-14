const db = require('../../config/db/index');
const models = require('../models/Models');

class FoodController {

    // GET /foods/stored
    storedFoods(req, res){
      models.monan.findAll({})
        .then( result => {
          var foods = result.map((currentValue) => {
                    return currentValue;
                  });
          res.render('foods/stored-foods',{foods});
        })
        .catch(err => console.log('Error storedfood: ' + err));
    }


    async showFoodID(req, res){

      var total;
      var name;
      var month = [];
      
      for (let i = 0; i < 12; i++) {
        month[i] = 0;
      }
      //console.log(month.length);
      var monanfindall = models.monan.findAll({
        include:[{
          model: models.phieudat,
          include: [{
            model: models.banpv
          }]
        }],
        where: {
          monid: `${req.params.id}`,
        }
      });

      var monanMonth = models.phieudat.findAll({
        raw: true,
        attributes: [
          [db.fn('date_part','month', db.col('thoigian')), 'month'],
          [db.fn('sum', db.col('soluong')), 'Soluong'],
        ],
        include: [{
          attributes: [
            //[db.fn('sum', db.col('soluong')), 'Soluong'],
          ],
          model: models.banpv,
        }
        ],
        where: {
          monid: `${req.params.id}`,
        },
        group:[db.fn("date_part",'month',db.col('banpv.thoigian')), 'phieudat.monid'],
        order:[[db.fn("date_part",'month',db.col('thoigian')), 'asc']]
      })

      try {
        var resmonanMonth = await monanMonth;
        for (const value of resmonanMonth) {
          month[value.month - 1] = Number(value.Soluong);
        }
        console.log(resmonanMonth.length);
      } catch (error) {
        console.log('ERROR showFoodID1: ' + error );
      }

      try {
        var resmonanfindall = await monanfindall;
        name = resmonanfindall[0].tenmon
        total = resmonanfindall[0].phieudats.reduce((total, currentValue) => {
          return total + currentValue.soluong;
        }, 0);

      } catch (error) {
        console.log('ERROR showFoodID: ' + error )
      }

      res.render('foods/inforFood',{name ,total, month});
    }

    // DELETE /foods/:id/delete
    async deleteFoods(req, res){
      await models.monan.destroy({
        where: {
          monid: `${req.params.id}`
        }
      })
        .then()
        .catch(err => console.log('ERROR deleteFood: ' + err))
      res.redirect('/foods/stored');
    }
    
    // GET /foods/:id/edit
    editFoods(req, res, next) {
      models.monan.findAll({
        where: {
          monid: `${req.params.id}`
        }
      })
        .then(result => {
          var food = result[0];
          res.render('foods/edit',{food});
        })
        .catch(err => console.log('ERROR editFoods: ' + err))

    }

  // PUT /foods/:id
  async updateFood(req, res, next) {

    var values = {tenmon: `${req.body.name}`, dongia: req.body.dongia,img: `${req.body.img}`,};
    var condition = {where:{monid: `${req.params.id}`}};

    await models.monan.update(values,condition)
      .then()
      .catch(err => console.log('ERROR updateFood: ' + err))
    res.redirect('/foods/stored');
  }

  //GET /foods/create
  createFood(req, res, next) {
    res.render('foods/create');
  }

  async insert(req, res) {
    await models.monan.create({
      tenmon: `${req.body.name}`,
      dongia: `${req.body.dongia}`,
      img: `${req.body.img}`
    })
      .then()
      .catch(err => console.log('ERROR create food: ' + err))
    res.redirect('/foods/stored');
  }
}

module.exports = new FoodController;