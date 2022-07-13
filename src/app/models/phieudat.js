const db = require('../../config/db/index');

export default db.define('phieudat',{
    phucvuid : {type: DataTypes.INTEGER, primaryKey: true, allowNull: false},
    monid: {type: DataTypes.INTEGER, primaryKey: true, allowNull: false},
    soluong: {type: DataTypes.INTEGER, allowNull: false},
    ghichu: {type: DataTypes.TEXT},
    
}, {
    timestamps: false
});