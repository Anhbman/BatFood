const Sequelize = require('sequelize');


const user = 'postgres';
const database = 'projectNodejs';
const password = '1304';
const host = 'localhost';
const port = 5432;


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