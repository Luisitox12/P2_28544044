var express = require('express');
var router = express.Router();

router.get('/', ensureAuthenticated, async function(req, res, next) {
  // El usuario ha iniciado sesión, mostrar la página de contactos
  const rows = await db.all('SELECT * FROM contactos');
  res.render('contactos', { title: 'Contactos', data: rows });
});

function ensureAuthenticated(req, res, next) {
  if (!req.session.user) {
    // El usuario no ha iniciado sesión, redirigir al usuario a la página de inicio
    res.redirect('/auth/login');
  } else {
    next();
  }
}


// Middleware de autenticación
function ensureAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  } else {
    req.flash('error_msg', 'Por favor inicie sesión para ver los datos');
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