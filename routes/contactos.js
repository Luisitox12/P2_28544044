var express = require('express');
var router = express.Router();
var db = require('../conf/database');

// Middleware de autenticación
function ensureAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  } else {
    req.flash('error_msg', 'Por favor Inicie Sesion para ver los datos');
    res.redirect('/auth/login');
  }
}

// Ruta de contactos protegida
router.get('/', ensureAuthenticated, async function(req, res, next) {
  try {
    const rows = await db.all('SELECT * FROM contactos');
    res.render('contactos', { title: 'Contactos', data: rows });
  } catch (err) {
    console.error(err);
    res.render('error', { message: 'Error retrieving contacts', error: err });
  }
});

module.exports = router;