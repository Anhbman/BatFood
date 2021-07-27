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
      var totalVistor = 0;

      // Tinh tổng tiền và tổng orders
      await models.hoadon.findAndCountAll()
        .then(result => {
          totalHD = result.count;
          totaldoanhthu = result.rows.reduce((total, currentValue) => {
            return total + currentValue.tongtien;
          }, 0)
        })
        .catch(err => console.log('ERROR RevenueController: ' + err))

        // tính tổng khách hàng
      await models.banpv.count({
          distinct: true,
          col: 'khachhangid',
        })
          .then(result => totalVistor = result)
          .catch(err => console.log('ERROR tongkhachhang: ' + err))

          // lấy dữ liệu vẽ biểu đồ
      // await Sequelize.query(`select m.tenmon, sum(soluong) "Soluong",sum(soluong)*dongia "tongtien"
      //                 from monan m,phieudat p, banpv b
      //                 where m.monID = p.monID
      //                 and b.phucvuID = p.phucvuID
      //                 group by m.monID
      //                 order by sum(soluong) desc`)
      //   .then(result => {
      //     foodsname = result[0].map( currentValue => currentValue.tenmon);
      //     foodssl = result[0].map( currentValue => currentValue.Soluong);
      //   })
      //   .catch(err => console.log('ERROR show revenue' + err))
        
      await models.phieudat.findAll({
        attributes: [
          'monid',
          [Sequelize.fn('sum', Sequelize.col('soluong')), 'Soluong'],
        ],
        include:[
          {
            attributes: [
              'monid',
              'tenmon',
            ],
            model: models.monan,
          }
        ],
        group: ['phieudat.monid', 'monan.monid'],
        order: [ [Sequelize.fn('sum', Sequelize.col('soluong')), 'desc']]
      })
        .then(result => {
          console.log(result);
          foodssl = result.map(currentValue => {
            return currentValue.dataValues.Soluong;
          });

          foodsname = result.map(currentValue => {
            return currentValue.dataValues.monan.tenmon;
          });
        })
        .catch(err => console.log('ERROR thong ke mon an ' + err))
        
        //lấy thông tin hoá đơn
        
        var hoadon;
        await models.hoadon.findAll({
          attributes: [
            'phucvuid',
            'thoigian',
            'tongtien'
          ],
          include:[
            {
              attributes: ['phucvuid', 'khachhangid'],
              model: models.banpv,
              include:[
                {
                  attributes: ['khachhangid', 'hoten'],
                  model: models.khachhang,
                }
              ],
            }
          ],
          order:[ ['thoigian', 'desc']]
        })
          .then(result => hoadon = result.map(currentValue => currentValue))
          .catch(err => console.log('ERROR thong hoa don' + err))

        // tính doanh thu
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
          res.render('revenues/revenue',{name: foodsname, soluong: foodssl, doanhthu, totalHD, totaldoanhthu, totalVistor, hoadon});
          //res.json(records2)
  
    }
}

module.exports = new RevenueController;