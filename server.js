if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const indexRouter = require('./routes/index');
const authorRouter = require('./routes/authors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false, limit: '10mb' }));


mongoose.connect(process.env.DATABASE_URL)
// const db = mongoose.connection
// db.on('error', error => console.error(error));
// db.on('open', () => console.log('Connected To Mongoose'));



app.use('/', indexRouter);
app.use('/authors', authorRouter);

app.listen(process.env.PORT || port);