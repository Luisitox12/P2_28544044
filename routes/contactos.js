var express = require('express');
var router = express.Router();
var db = require('../conf/database');

router.get('/', ensureAuthenticated, async function(req, res, next) {
  // El usuario ha iniciado sesión, mostrar la página de contactos
  const rows = await new Promise((resolve, reject) => {
    db.getAllContacts((err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
    });
  res.render('contactos', { title: 'Contactos', data: rows });
});

function ensureAuthenticated(req, res, next) {
  if (!req.session.user) {
    // El usuario no ha iniciado sesión, redirigir al usuario a la página de inicio
    res.redirect('/login');
  } else {
    next();
  }
}

module.exports = router;