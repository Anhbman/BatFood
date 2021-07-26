const Sequelize = require('sequelize');


const user = process.env.USER_DB;
const database = process.env.DATABASE;
const password = process.env.PASSWORD_DB;
const host = process.env.HOST_DB;
const port = process.env.PORT_DB;


const sequelize = new Sequelize(database, user, password, {
  host,
  port,
  dialect: 'postgres',
  logging: false,
  operatorsAliases: '0'
})

async function connect() {
  console.log('Checking database connection...');
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
}

module.exports = new Sequelize(database, user, password, {
  host,
  port,
  dialect: 'postgres',
  logging: false,
  define: {
    freezeTableName: true
  },
})