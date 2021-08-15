const models = require('../models/Models');
const Sequelize = require('../../config/db/index');
const { render } = require('node-sass');

class ManageController{
   
    async showCustomer(req, res){

        var pageSize = 5;
        var start = 0;
        var page = [];
        var khachhang;

      var countKhachHang = models.khachhang.count();

      try {
        var resCount = await countKhachHang;
      } catch (error) {
        console.log("ERROR countKhachHang: " + error);
      }

      var pageNumber = Math.ceil( resCount/pageSize );
      start = (req.query.page - 1)*pageSize;

      if(req.query.page === 'max' || req.query.page > pageNumber)
        start = (pageNumber-1)*pageSize;
      if(req.query.page === undefined)
        start = 0;   
      
      var dataKhachHang = models.khachhang.findAndCountAll({
        raw: true,
        order: [['diemtichluy', 'DESC']],
        offset: start,
        limit: pageSize
      });

      try {
        var resData = await dataKhachHang;

        var count = resData.count/pageSize;

        for (let i = 0; i < count; i++) {
              page.push(i);
        }
        khachhang = resData.rows.map(currentValue => {
          currentValue.stt = start + 1;
          return currentValue;
        });
      } catch (error) {
        console.log("ERROR dataKhachHang: " + error);
      }

      res.render('manage/customer',{khachhang, page});
    }

    async showPersonnel(req, res){
        var pageSize = 5;
        var start = 0;
        var page = [];
        var nhanvien;

      var countPer = models.nhanvien.count({});


      try {
        var resCount = await countPer;
      } catch (error) {
        console.log('ERROR countPer: '+ error);
      }

      var pageNumber = Math.ceil( resCount/pageSize );

      start = (req.query.page - 1)*pageSize;
      if(req.query.page === 'max' || req.query.page > pageNumber)
        start = (pageNumber-1)*pageSize;
      if(req.query.page === undefined)
        start = 0;
      
      var dataNhanVien = models.nhanvien.findAndCountAll({
        raw: true,
        offset: start,
        limit: pageSize
      });
      
      try {
        var resNhanVien = await dataNhanVien;
        var count = resNhanVien.count/pageSize;
        for (let i = 0; i < count; i++) {
              page.push(i);
        }
        nhanvien = resNhanVien.rows.map(currentValue => {
          currentValue.stt = start + 1;
          return currentValue;
        });
      } catch (error) {
        console.log('ERROR dataNhanVien:' + error);
      }

      res.render('manage/personnel',{nhanvien, page})
    }

    async createCustomer(req, res){
        res.render('manage/createCustomer')
    }

    async insertCustomer(req, res) {
      var values = {hoten: `${req.body.name}`, gioitinh: `${req.body.gioitinh}`, sdt: `${req.body.sdt}`};
      await models.khachhang.create(values)
        .then()
        .catch(err => console.log('ERROR insertCustomer: ' + err))
      //res.redirect('/manage/customer')
      res.redirect('/manage/customer?page=max');
    }

    createPersonnel(req, res){
      res.render('manage/createPersonnel');
    }

    async insertPersonnel(req, res) {

      var values = {hoten: `${req.body.name}`, gioitinh: `${req.body.gioitinh}`, sdt: `${req.body.sdt}`, ngaysinh: `${req.body.ngaysinh}`};
      await models.nhanvien.create(values)
        .then()
        .catch(err => console.log('ERROR insertPersonnel: ' + err))
      res.redirect('/manage/personnel?page=max');
    }

    async editCustomer(req, res){

      await models.khachhang.findAll({
        where: {khachhangid: `${req.params.id}`}
      })
        .then(result => {
          res.render('manage/editCustomer',{khachhang : result[0]});
        })
        .catch(err => console.log('ERROR editCustomer: ' + err))
    }

    async updateCustomer(req, res) {
      var values = {hoten: `${req.body.name}`, gioitinh: `${req.body.gioitinh}`, sdt: `${req.body.sdt}`}
      var condition = {where:{khachhangid: `${req.params.id}`}};

      await models.khachhang.update(values,condition)
        .then()
        .catch(err => console.log('ERROR updateCustomer: ' + err))
      res.redirect('/manage/customer?page=max');
    }

    async editPersonnel(req, res){
      await models.nhanvien.findAll({
        where: {nhanvienid: `${req.params.id}`}
      })
        .then(result => {
          res.render('manage/editPersonnel',{nhanvien : result[0]});
          //res.json(result)
        })
        .catch(err => console.log('ERROR editPersonnel: ' + err))
    }

    async updatePersonnel(req, res) {
      var values = {hoten: `${req.body.name}`, gioitinh: `${req.body.gioitinh}`, sdt: `${req.body.sdt}`, ngaysinh: `${req.body.ngaysinh}`}
      var condition = {where:{nhanvienid: `${req.params.id}`}};

      await models.nhanvien.update(values,condition)
        .then()
        .catch(err => console.log('ERROR updatePersonnel: ' + err))
      res.redirect('/manage/personnel?page=max');
    }

    showCustomerID(req, res) {
      models.khachhang.findAll({
        attributes: [
          'khachhangid',
          'hoten',
          'diemtichluy'
        ],
        include:[
          {
            attributes: ['phucvuid', 'khachhangid', 'thoigian'],
            model: models.banpv,
            include:[
              {
                attributes: ['phucvuid', 'tongtien'],
                model: models.hoadon,
              }
            ],
          }
        ],
        where: {
          khachhangid: `${req.params.id}`
        },
        order: [[models.banpv ,'thoigian', 'desc']],
      })
      .then(result => {
        var name = result[0].hoten;
        var customer = result[0].banpvs.map(currentValue => currentValue);
        var total = result[0].banpvs.reduce((total, currentValue) => {
          return total + currentValue.hoadon.tongtien;
        },0);
        var count = result[0].banpvs.length;
        var point = result[0].diemtichluy;
        res.render('manage/inforCustomer',{name, customer, count, total, point});
      })
      .catch(err => console.log('ERROR showCustomerID: ' + err))
    }

    async deletePersonnel(req, res) {
      await models.nhanvien.destroy({
        where: {
          nhanvienid: `${req.params.id}`
        }
      })
        .then()
        .catch(err => console.log('ERROR deletePersonnel: ' + err))
      res.redirect('back');
    }

    async deleteCustomer(req, res) {

      var Err = [];
      await models.khachhang.destroy({
        where: {
          khachhangid: `${req.params.id}`
        }
      })
        .then()
        .catch(err => {
          console.log('ERROR deleteCustomer: ' + err);
          Err.push(err);
        })
      res.redirect(`back`)
    }
}

module.exports = new ManageController;