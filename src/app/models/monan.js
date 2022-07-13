const db = require('../../config/db/index');

export default db.define('monan',{
    monid : {type: DataTypes.INTEGER , allowNull: false,primaryKey: true, autoIncrement: true},
    tenmon: {type: DataTypes.STRING, allowNull: false},
    dongia: {type: DataTypes.INTEGER, allowNull: false},
    maloai: {type: DataTypes.STRING},
    img   : {type: DataTypes.TEXT},
}, {
    timestamps: false
});