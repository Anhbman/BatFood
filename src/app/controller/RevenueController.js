const models = require('../models/Models');
const Sequelize = require('../../config/db/index');

class RevenueController{

    // GET revenue
    async show(req, res){

      var foodsname;
      var foodssl;
      var doanhthu;
      var totalHD;
      var totaldoanhthu;

      models.hoadon.findAndCountAll()
        .then(result => {
          totalHD = result.count;
          totaldoanhthu = result.rows.reduce((total, currentValue) => {
            return total + currentValue.tongtien;
          }, 0)
        })
      
      await Sequelize.query(`select m.tenmon, sum(soluong) "Soluong",sum(soluong)*dongia "tongtien"
                      from monan m,phieudat p, banpv b
                      where m.monID = p.monID
                      and b.phucvuID = p.phucvuID
                      group by m.monID
                      order by sum(soluong) desc`)
        .then(result => {
          foodsname = result[0].map( currentValue => currentValue.tenmon);
          foodssl = result[0].map( currentValue => currentValue.Soluong);
        })
        .catch(err => console.log('ERROR show revenue' + err))

        await Sequelize.query(`select sum(tongtien) as doanhthu
                         from hoadon
                         group by date_part('month',thoigian)
                         order by date_part('month',thoigian) asc`)
          .then(result => {
              doanhthu = result[0].map(currentValue => {
                return Number(currentValue.doanhthu);
              });
          })
          .catch(err => console.log('ERROR show revenue' + err))
          res.render('revenues/revenue',{name: foodsname, soluong: foodssl, doanhthu, totalHD, totaldoanhthu});
          //res.json(records2)
  
    }
}

module.exports = new RevenueController;