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
      res.redirect('/manage/customer')
    }

    async createPersonnel(req, res){

      await models.nhanvien.findAll()
        .then(result => {
          var id = result.length*10 + 1;
          console.log('id = ' + id);
          //res.json(result);
          res.render('manage/createPersonnel',{id})
        })
        .catch(err => console.log('ERROR createPersonnel: ' + err))

    }

    async insertPersonnel(req, res) {

      var values = {nhanvienid: `${req.params.id}` ,hoten: `${req.body.name}`, gioitinh: `${req.body.gioitinh}`, sdt: `${req.body.sdt}`, ngaysinh: `${req.body.ngaysinh}`};
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

    async showCustomerID(req, res) {
      await Sequelize.query(`select k.khachhangid, k.hoten, k.diemtichluy, b.phucvuid, h.tongtien, to_char(h.thoigian, 'YYYY-MM-DD HH24:MI:SS') as thoigian
                            from khachhang k, banpv b, phieudat p, hoadon h
                            where k.khachhangid = b.khachhangid
                            and b.phucvuid = p.phucvuid
                            and p.phucvuid = h.phucvuid
                            and k.khachhangid = '${req.params.id}'
                            group by (b.phucvuid, k.khachhangid, h.tongtien, h.thoigian)
                            order by h.thoigian`)
        .then(result => {
          var customer = result[0];
          var count = customer.length;
          var total = 0;
          var point = 0;
          if(count > 0){
            point = customer[0].diemtichluy
            var name = customer[0].hoten;
            total = customer.reduce((total, currentValue) => {
              return total + (currentValue.tongtien);
            },0)
          }
          res.render('manage/inforCustomer',{name,customer, count, total, point});
        })
        .catch(err => console.log('ERROR showCustomerID: ' + err))
    }

    deletePersonnel(req, res) {
      models.nhanvien.destroy({
        where: {
          nhanvienid: `${req.params.id}`
        }
      })
        .then()
        .catch(err => console.log('ERROR deletePersonnel: ' + err))
      res.redirect('back');
    }

    deleteCustomer(req, res) {
      models.khachhang.destroy({
        where: {
          khachhangid: `${req.params.id}`
        }
      })
        .then()
        .catch(err => console.log('ERROR deleteCustomer: ' + err))
      res.redirect('back')
    }
}

module.exports = new ManageController;