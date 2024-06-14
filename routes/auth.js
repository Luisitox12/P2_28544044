var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var db = require('../conf/database'); // Ajusta según tu configuración de base de datos

// Página de registro
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register' });
});

// Manejar registro
router.post('/register', async function(req, res, next) {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
    req.flash('success_msg', 'You are now registered and can log in');
    res.redirect('/auth/login');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Something went wrong. Please try again.');
    res.redirect('/auth/register');
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
    const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);
    console.log('User:', user);
    console.log('User.data:', user.data);
    if (!user) {
      req.flash('error_msg', 'No user found with that username');
      return res.redirect('/auth/login');
    }

    if (typeof user!== 'object') {
      req.flash('error_msg', 'Error al obtener usuario');
      return res.redirect('/auth/login');
    }
    if (!('data' in user)) {
      req.flash('error_msg', 'Error al obtener datos de usuario');
      return res.redirect('/auth/login');
    }
    if (typeof user.data!== 'object') {
      req.flash('error_msg', 'Error al obtener datos de usuario');
      return res.redirect('/auth/login');
    }
    if (!('password' in user.data)) {
      req.flash('error_msg', 'Error al obtener contraseña de usuario');
      return res.redirect('/auth/login');
    }

    const hashedPassword = user.data.password; // Accede a la contraseña hasheada
    const isMatch = await bcrypt.compare(password, hashedPassword);
    if (!isMatch) {
      req.flash('error_msg', 'Incorrect password');
      return res.redirect('/auth/login');
    }
    req.session.user = user;
    res.redirect('/contactos');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Something went wrong. Please try again.');
    res.redirect('/auth/login');
  }
});

// Manejar cierre de sesión
router.get('/logout', function(req, res) {
  req.session.destroy(err => {
    if (err) {
      return next(err);
    }
    res.redirect('/auth/login');
  });
});

module.exports = router;