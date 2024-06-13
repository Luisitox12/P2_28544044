var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var db = require('../conf/database'); // Ajusta según tu configuración de base de datos
const flash = require('connect-flash');
const session = require('express-session');

// Página de registro
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register' });
});

// Manejar registro
router.post('/register', async function(req, res, next) {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.run('INSERT INTO users (username, password) VALUES (?,?)', [username, hashedPassword]);
    req.flash('success_msg', 'You are now registered and can log in');
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Datos Invalidos. Porfavor intente denuevo.');
    res.redirect('/register');
  }
});

// Página de inicio de sesión
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

// Manejar inicio de sesión
router.post('/login', async function(req, res, next) {
  const { username, password } = req.body;
  try {
    const user = await db.get('SELECT * FROM users WHERE username =?', [username]);
    console.log('User:', user); // Verificar que el usuario esté siendo devuelto correctamente
    console.log('Password:', password); // Verificar que la contraseña esté siendo pasada correctamente
    console.log('User password:', user.password); // Verificar que la contraseña hasheada esté siendo devuelta correctamente
    if (!user) {
      req.flash('error_msg', 'No user found with that username');
      return res.redirect('/login');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.flash('error_msg', 'Incorrect password');
      return res.redirect('/login');
    }
    if (!req.session) {
      console.error('Error setting user in session');
      req.flash('error_msg', 'Error setting user in session');
      return res.redirect('/login');
    }
    req.session.user = user;
    res.redirect('/contactos');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Something went wrong. Please try again.');
    res.redirect('/login');
  }
});

// Manejar cierre de sesión
router.get('/logout', function(req, res) {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        return next(err);
      }
      res.redirect('/login');
    });
  } else {
    res.redirect('/login');
  }
});

module.exports = router;