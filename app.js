require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//nuevo añadido 1

var session = require('express-session');
var flash = require('connect-flash');

//Fin nuevo añadido 1

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var contactosRouter = require('./routes/contactos');
var authRouter = require('./routes/auth'); // Nueva ruta para autenticación

var app = express();

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

//añadido
app.use('/contactos', contactosRouter);
//fin añadido

// Configurar sesión
app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: true
}));
//Fin Configurar

//// Configurar flash
app.use(flash());

// Middleware para hacer mensajes flash disponibles en todas las vistas
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/contactos', contactosRouter);
app.use('/auth', authRouter); // Usar las rutas de autenticación
// Fin mensajes flash

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
