var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
//envio de correo
const express = require('express');
const transporter = require('./models/mail');

const app = express();

app.post('/register', (req, res) => {
  const { name, email } = req.body;

  const mailOptions = {
    from: 'pruebadeprogra@gmail.com',
    to: 'luishidalgops6@gmail.com', // Add more recipients as needed
    subject: 'New user registration',
    text: `Name: ${name}\nEmail: ${email}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send('Error sending email');
    } else {
      console.log(`Email sent: ${info.response}`);
      res.status(200).send('User registered and email sent');
    }
  });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
//fin envio de correo

/* const db = require('./conf/db'); */
const ContactosController = require('./controllers/ContactosController');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
