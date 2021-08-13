const db = require('../../config/db/index');
const models = require('../models/Models');
const { Op } = require("sequelize");

class SiteController{
    

  logout(req, res){
    res.clearCookie("acc");
    res.redirect("/login");
  }

    async show(req, res){

      var date = new Date();
      //res.json(date.getHours())
      var startDate = new Date();
      var endDate = new Date();
      var startDate2 = new Date();
      var preMonthRev = 0;
      var thisMonthRev = 0;
      var preMonthOrder = 0;
      var thisMonthOrder = 0;
      var preMonthClient = 0;
      var thisMonthClient = 0;
      var foods = [];
      var totalMenus = 0;
      //res.json(endDate);

      startDate.setMonth(date.getMonth() - 1);
      // startDate.setDate(startDate.getDate() + 1);
      // endDate.setDate(endDate.getDate() + 1);
      startDate2.setMonth(date.getMonth() - 2);
      
      // Tính doanh thu và số lượng order

      var doanhthu = models.hoadon.findAll({
        raw: true,
        attributes: [
          'phucvuid',
          'tongtien',
          'thoigian'
        ],
        where: {
          thoigian:{
            [Op.or]: [{
             [Op.between]: [startDate, endDate]
            },
            {
              [Op.between]: [startDate2, startDate]
            }
            ]
        }
      },
      order:[['thoigian', 'ASC']]
      });

   
      // Tổng số khách hàng phục vụ tháng này
      var khachhangpvNow = models.banpv.count({
        distinct: true,
        col: 'khachhangid',
        where: {
          thoigian:{
              //[Op.between]: [startDate, endDate]
              [Op.gte]: startDate,
              [Op.lte]: endDate, 
        }
      },
      });

      // tổng số khách hàng phục vụ tháng trước
      var khachhangpvPrev = models.banpv.count({
          distinct: true,
          col: 'khachhangid',
          where: {
            thoigian:{
               //startDate2, startDate
               [Op.gte]: startDate2,
               [Op.lte]: startDate, 
          }
        },
        });

      // tính tổng món ăn
      var monanCount = models.monan.findAndCountAll();
     

      // Tính doanh thu và số lượng order
      try {
        
        var resdoanhthu = await doanhthu;

        //res.json(resdoanhthu);
        for(let i = 0 ; i < resdoanhthu.length; i++){
          if (resdoanhthu[i].thoigian <= endDate && resdoanhthu[i].thoigian >= startDate) {
            thisMonthRev += resdoanhthu[i].tongtien;
            thisMonthOrder++;
            //res.json(thisMonthRev)
          }else if(resdoanhthu[i].thoigian < startDate && resdoanhthu[i].thoigian >= startDate2){
            preMonthRev += resdoanhthu[i].tongtien;
            preMonthOrder++;
          }
        }
        //res.json(thisMonthRev);
        if(preMonthOrder && preMonthRev){
          preMonthOrder = ((thisMonthOrder - preMonthOrder)*100/preMonthOrder).toFixed(2);
          preMonthRev = ((thisMonthRev - preMonthRev)*100/preMonthRev).toFixed(2);
          thisMonthRev = thisMonthRev/1000;
        }

      } catch (error) {
        console.log('ERROR showHome Tong tien: ' + error)
      }

      // Tính tổng số khách hàng
      try {
        var preMonthClient = await khachhangpvPrev;
        var thisMonthClient = await khachhangpvNow;

      } catch (error) {
        console.log('ERROR tongkhachhang: ' + error)
      }
     
      // Danh sach va tong mon an
      try {
        var resmonanCount = await monanCount;
        foods = resmonanCount.rows.map((currentValue) => {
                  return currentValue;
                });
        totalMenus = resmonanCount.count;

      } catch (error) {
        console.log('Error storedfood: ' + error)
      }

      res.render('home',{foods, thisMonthRev, preMonthRev, totalMenus, thisMonthOrder, preMonthOrder, thisMonthClient, preMonthClient});
    }
}

module.exports = new SiteController;