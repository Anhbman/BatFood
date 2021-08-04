const models = require('../models/Models');
const Sequelize = require('../../config/db/index');

class RevenueController{

    // GET revenue
    async show(req, res){

      console.time('taskA');

      var foodsname;          // danh sách món ăn
      var foodssl;            // số lượng từng món ăn đã bán
      var doanhthu;           // Tổng doanh thu từng tháng
      var totalHD;            // tổng hoá đơn đã bán
      var totaldoanhthu;      // Tổng doanh thu 
      var totalVistor = 0;    // Tổng khách hàng
      var pageSize = 10;      //
      var start = 0;
      var page = [];          // số lượng page

      console.log(req.params);
      if(req.params.page > 0)
        start = (req.params.page-1)*pageSize;

      // Tính tổng doanh thu của quán
      var hoadonFindCount = models.hoadon.findAndCountAll({});

      // Tính tổng số lượng khách hàng
      var banpvCount = models.banpv.count({
        distinct: true,
        col: 'khachhangid',
      });
  
      // Danh sách các món ăn và số lượng được bán
      var phieudatfindAll = models.phieudat.findAll({
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

      // Thông tin các hoá đơn
      var hoadonfindAndCountAll = models.hoadon.findAndCountAll({
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
        order:[['thoigian', 'desc']],
        offset: start,
        limit: pageSize
      })

      // Tính doanh thu hàng tháng
      var doanhthuthang = Sequelize.query(`select sum(tongtien) as doanhthu
        from hoadon
        group by date_part('month',thoigian)
        order by date_part('month',thoigian) asc`);

      
      // Tính tổng doanh thu của quán
      try {
        var reshoadonFindCount = await hoadonFindCount;

        totalHD = reshoadonFindCount.count;
        totaldoanhthu = reshoadonFindCount.rows.reduce((total, currentValue) => {
          return total + currentValue.tongtien;
        }, 0);

      } catch (error) {
        console.log('ERROR hoadonFindCount' + error);
      }
     
      
      // Tính tổng khách hàng
      try {
        var resbanpvCount = await banpvCount;
        totalVistor = resbanpvCount;
      } catch (error) {
        console.log('Error banpvCount'  + error.message);
      }
      
        

      // lấy dữ liệu vẽ biểu đồ        
      try {
        var resphieudatfindAll = await phieudatfindAll;
        foodssl = resphieudatfindAll.map(currentValue => {
          return currentValue.dataValues.Soluong;
        });
    
        foodsname = resphieudatfindAll.map(currentValue => {
          return currentValue.dataValues.monan.tenmon;
        });

      } catch (error) {
        console.log('ERROR thong ke mon an ' + error)
      }
      
        
      var hoadon;
      var count;
       
      // In ra danh sách hoá đơn
      try {

        var reshoadonfindAndCountAll = await hoadonfindAndCountAll;
        hoadon = reshoadonfindAndCountAll.rows.map(currentValue => {
          currentValue.stt = start + 1;
          return currentValue;
        })
        count = reshoadonfindAndCountAll.count;
        count = count/pageSize;
        for (let i = 0; i < count; i++) {
            page.push(i);
        };
      } catch (error) {
        console.log('ERROR hoadonfindAndCountAll' + error);
      }
      
      // Tính doanh thu tháng
      try {

        var resdoanhthuthang = await doanhthuthang;
        doanhthu = resdoanhthuthang[0].map(currentValue => {
          return Number(currentValue.doanhthu);
        });
      } catch (error) {
        console.log('ERROR doanhthuthang' + error)
      }
      
      res.render('revenues/revenue',{name: foodsname, soluong: foodssl, doanhthu, totalHD, totaldoanhthu, totalVistor, hoadon, page});
      console.timeEnd("taskA");
    }
}

module.exports = new RevenueController;