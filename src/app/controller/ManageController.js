const models = require('../models/Models');
const Sequelize = require('../../config/db/index');

class ManageController{
   
    async showCustomer(req, res){

        var pageSize = 5;
        var start = 0;
        var page = [];
        var khachhang;
        if(req.query.page > 0)
         start = (req.query.page-1)*pageSize;
         
      await models.khachhang.findAndCountAll({
        order: [['diemtichluy', 'DESC']],
        offset: start,
        limit: pageSize
      })
        .then( result => {
          var count = result.count/pageSize;
          for (let i = 0; i < count; i++) {
               page.push(i);
          }
          khachhang = result.rows.map(currentValue => {
            currentValue.dataValues.stt = start + 1;
            return currentValue.dataValues;
          });
          //res.json(result)
        })
        .catch(err => console.log('Error showCustomer: ' + err))
        res.render('manage/customer',{khachhang, page});
        //res.json(khachhang);
    }

    async showPersonnel(req, res){
        var pageSize = 5;
        var start = 0;
        var page = [];
        var nhanvien;
        if(req.query.page > 0)
         start = (req.query.page-1)*pageSize;
      await models.nhanvien.findAndCountAll({
        offset: start,
        limit: pageSize
      })
        .then(result => {
          var count = result.count/pageSize;
          for (let i = 0; i < count; i++) {
               page.push(i);
          }
          nhanvien = result.rows.map(currentValue => {
            currentValue.dataValues.stt = start + 1;
            return currentValue.dataValues;
          });
        })
        .catch(err => console.log('Error showPersonnel: ' + err))
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
      res.redirect('/manage/customer');
    }

    createPersonnel(req, res){
      res.render('manage/createPersonnel');
    }

    async insertPersonnel(req, res) {

      var values = {hoten: `${req.body.name}`, gioitinh: `${req.body.gioitinh}`, sdt: `${req.body.sdt}`, ngaysinh: `${req.body.ngaysinh}`};
      await models.nhanvien.create(values)
        .then(result => {
          //res.json(result);
        })
        .catch(err => console.log('ERROR insertPersonnel: ' + err))
      res.redirect('/manage/personnel');
    }

    async editCustomer(req, res){

      await models.khachhang.findAll({
        where: {khachhangid: `${req.params.id}`}
      })
        .then(result => {
          res.render('manage/editCustomer',{khachhang : result[0]});
          //res.json(result)
        })
        .catch(err => console.log('ERROR editCustomer: ' + err))
    }

    async updateCustomer(req, res) {
      var values = {hoten: `${req.body.name}`, gioitinh: `${req.body.gioitinh}`, sdt: `${req.body.sdt}`}
      var condition = {where:{khachhangid: `${req.params.id}`}};

      await models.khachhang.update(values,condition)
        .then()
        .catch(err => console.log('ERROR updateCustomer: ' + err))
      res.redirect('/manage/customer')
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
      res.redirect('/manage/personnel');
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
      await models.khachhang.destroy({
        where: {
          khachhangid: `${req.params.id}`
        }
      })
        .then()
        .catch(err => console.log('ERROR deleteCustomer: ' + err))
      res.redirect(`back`)
    }
}

module.exports = new ManageController;