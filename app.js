require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var flash = require('connect-flash');
const passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Configurar sesión
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// Configurar flash
app.use(flash());

// Middleware para hacer mensajes flash disponibles en todas las vistas
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// Configuración de la estrategia de Google OAuth
passport.use(new GoogleStrategy({
  clientID: process.env.USER_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL
},
function(accessToken, refreshToken, profile, done) {
  return done(null, profile);
}));

app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// Ruta de callback de Google
app.get('/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: '/auth/login',
    failureFlash: true 
  }),
  (req, res) => {
    // Verificar que la sesión esté configurada correctamente
    console.log('Sesión:', req.session);

    // Almacenar la información del usuario autenticado en la sesión
    req.session.user = req.user;

    res.redirect('/contactos');
  }
);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var contactosRouter = require('./routes/contactos');
var authRouter = require('./routes/auth'); // Nueva ruta para autenticación

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/contactos', contactosRouter);
app.use('/auth', authRouter); // Usar las rutas de autenticación

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