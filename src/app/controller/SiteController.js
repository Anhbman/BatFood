const db = require('../../config/db/index');
const models = require('../models/Models');
const { Op } = require("sequelize");
const moment = require('moment');

class SiteController{
    
    async show(req, res){

      var date = new Date();
      var startDate = new Date();
      startDate.setMonth(date.getMonth() - 1);
      startDate.setDate(startDate.getDate() + 1);
      var endDate = new Date();
      endDate.setDate(endDate.getDate() + 1);
      var startDate2 = new Date();
      startDate2.setMonth(date.getMonth() - 2);
      var preMonthRev = 0;
      var thisMonthRev = 0;
      //res.json(startDate);

      // Tính doanh thu
      await models.hoadon.findAll({
        attributes: [
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
      })
        .then(result => {

          for(let i = 0 ; i < result.length; i ++){
            if (result[i].dataValues.thoigian.getMonth() === endDate.getMonth()) {
              thisMonthRev += result[i].dataValues.tongtien;
            }else{
              preMonthRev += result[i].dataValues.tongtien;
            }
          }
          preMonthRev = ((thisMonthRev - preMonthRev)*100/preMonthRev).toFixed(2);
          thisMonthRev = thisMonthRev/1000;

        })
        .catch(err => console.log('ERROR showHome Tong tien: ' + err))

        //tính tổng order

        var preMonthOrder = 0;
        var thisMonthOrder = 0;
        await models.hoadon.findAll({
          attributes: [
            'phucvuid',
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
        })
          .then(result => {
            for(let i = 0 ; i < result.length; i ++){
              if (result[i].dataValues.thoigian.getMonth() === endDate.getMonth()) {
                thisMonthOrder++;
              }else{
                preMonthOrder++;
              }
            }
            preMonthOrder = ((thisMonthOrder - preMonthOrder)*100/preMonthOrder).toFixed(2);
          })
          .catch(err => console.log('ERROR TongOrder: ' + err))

        var preMonthClient = 0;
        var thisMonthClient = 0;

        // Tính tổng số kháchc hàng

        await models.banpv.count({
          distinct: true,
          col: 'khachhangid',
          where: {
            thoigian:{
               //startDate2, startDate
               [Op.gte]: startDate2,
               [Op.lte]: startDate, 
          }
        },
        })
          .then(result => preMonthClient = result)
          .catch(err => console.log('ERROR tongkhachhang: ' + err))
        
        await models.banpv.count({
          distinct: true,
          col: 'khachhangid',
          where: {
            thoigian:{
                //[Op.between]: [startDate, endDate]
                [Op.gte]: startDate,
                [Op.lte]: endDate, 
          }
        },
        })
          .then(result => thisMonthClient = result)
          .catch(err => console.log('ERROR tongkhachhang: ' + err))
        if(preMonthClient){
          preMonthClient = ((thisMonthClient - preMonthClient)*100/preMonthClient).toFixed(2);
        }

        // tính tổng món ăn
        var foods = [];
        var totalMenus = 0;
        await models.monan.findAndCountAll()
          .then( result => {
            foods = result.rows.map((currentValue) => {
                      return currentValue;
                    });
            totalMenus = result.count;
            
          })
          .catch(err => console.log('Error storedfood: ' + err));
        res.render('home',{foods, thisMonthRev, preMonthRev, totalMenus, thisMonthOrder, preMonthOrder, thisMonthClient, preMonthClient});
    }
}

module.exports = new SiteController;