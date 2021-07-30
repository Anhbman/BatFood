const express = require('express');
const morgan = require('morgan');
const handlebars = require('express-handlebars');
const path = require('path');
const methodOverride = require('method-override');
var pgp = require('pg-promise')(/* options */);
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv');

dotenv.config();

const route = require("./routes/index");
const db = require('./config/db/index');


//db.connect();

db.authenticate()
  .then(() => console.log('Database connected'))
  .catch(err => console.log('Error: ') + err)

const app = express();
const port = process.env.PORT || 3000;

// Xử lý nhận dữ liệu từ form-data
app.use(express.urlencoded());
// Xử lý submit dữ liệu
app.use(express.json());
// http loger
app.use(morgan('combined'));
app.use(cookieParser());

// template engine
app.engine('hbs',handlebars({
    extname: '.hbs', 
    helpers: require('./helpers/helpershbs'),
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
          },
      
    }
));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources','views'));


app.use(express.static(path.join(__dirname, 'public')));

app.use(methodOverride('_method'))

route(app);


app.listen(port, () => console.log(`App listening at http://localhost:${port}`));