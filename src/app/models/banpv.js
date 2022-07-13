const db = require('../../config/db/index');
const moment = require('moment');

export default db.define('banpv',{
    phucvuid : {type: DataTypes.INTEGER , primaryKey: true, allowNull: false, autoIncrement: true},
    banid: {type: DataTypes.INTEGER, allowNull: false},
    khachhangid: {type: DataTypes.INTEGER, allowNull: false},
    nhanvienid: {type: DataTypes.INTEGER, allowNull: false},
    thoigian: {type: DataTypes.TIME, allowNull: false,
        get: function() {
            return moment(this.getDataValue('thoigian')).format('YYYY-MM-DD h:mm:ss a')
         }},
    
}, {
    freezeTableName: true,
    timestamps: false
});