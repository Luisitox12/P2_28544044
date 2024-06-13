var express = require('express');
var router = express.Router();
var db = require('../conf/database');



/* GET contactos page. */
router.get('/', function(req, res, next) {
  const query = 'SELECT email, nombre, mensaje, ip, fecha, pais FROM contactos'; // Reemplaza 'your_table_name' con el nombre de tu tabla

  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.render('contactos', { title: 'Contactos', data: rows });
  });
});

// Middleware de autenticación
function ensureAuthenticated(req, res, next) {
  if (req.session.user) {
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