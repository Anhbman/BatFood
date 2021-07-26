
const { Sequelize, DataTypes } = require('sequelize');
const db = require('../../config/db/index');
const moment = require('moment');


var monan = db.define('monan',{
    monid : {type: DataTypes.INTEGER , allowNull: false,primaryKey: true, autoIncrement: true},
    tenmon: {type: DataTypes.STRING, allowNull: false},
    dongia: {type: DataTypes.INTEGER, allowNull: false},
    maloai: {type: DataTypes.STRING},
    img   : {type: DataTypes.TEXT},
    cachnau: {type: DataTypes.TEXT},
}, {
    timestamps: false
});

var banpv = db.define('banpv',{
    phucvuid : {type: DataTypes.INTEGER , primaryKey: true, allowNull: false, autoIncrement: true},
    banid: {type: DataTypes.INTEGER, allowNull: false},
    khachhangid: {type: DataTypes.INTEGER, allowNull: false},
    nhanvienid: {type: DataTypes.INTEGER, allowNull: false},
    thoigian: {type: DataTypes.DATEONLY, allowNull: false},
    
}, {
    freezeTableName: true,
    timestamps: false
});

var hoadon = db.define('hoadon',{
    phucvuid : {type: DataTypes.INTEGER , primaryKey: true, allowNull: false},
    nhanvienid: {type: DataTypes.INTEGER, allowNull: false},
    tongtien: {type: DataTypes.INTEGER, allowNull: false},
    thoigian: {type: DataTypes.TIME, allowNull: false},
    ghichu: {type: DataTypes.TEXT},
    
}, {
    timestamps: false
});

var khachhang = db.define('khachhang',{
    khachhangid : {type: DataTypes.STRING , primaryKey: true, allowNull: false, autoIncrement: true},
    hoten: {type: DataTypes.STRING, allowNull: false},
    gioitinh: {type: DataTypes.CHAR},
    sdt: {type: DataTypes.STRING},
    diemtichluy: {type: DataTypes.INTEGER, defaultValue: 0},
}, {
    timestamps: false
});

var nhanvien = db.define('nhanvien',{
    nhanvienid : {type: DataTypes.STRING , primaryKey: true, allowNull: false, autoIncrement: true},
    hoten: {type: DataTypes.STRING, allowNull: false},
    gioitinh: {type: DataTypes.CHAR, allowNull: false},
    sdt: {type: DataTypes.STRING, allowNull: false},
    ngaysinh: {type: DataTypes.DATE, allowNull: false,
        get: function() {
            return moment(this.getDataValue('ngaysinh')).format('YYYY-MM-DD')
         }
    }
}, {
    timestamps: false
});

var phieudat = db.define('phieudat',{
    phucvuid : {type: DataTypes.INTEGER, primaryKey: true, allowNull: false},
    monid: {type: DataTypes.INTEGER, primaryKey: true, allowNull: false},
    soluong: {type: DataTypes.INTEGER, allowNull: false},
    ghichu: {type: DataTypes.TEXT},
    
}, {
    timestamps: false
});

var taikhoan =  db.define('taikhoan',{
    user : {type: DataTypes.STRING, primaryKey: true, allowNull: false},
    psw: {type: DataTypes.STRING, allowNull: false},
}, {
    timestamps: false
});

hoadon.hasMany(banpv, {
    foreignKey: 'phucvuid'
});
banpv.belongsTo(hoadon,  {
    foreignKey: 'phucvuid'
});


module.exports = {
    monan,
    banpv,
    hoadon,
    khachhang,
    nhanvien,
    phieudat,
    taikhoan
}