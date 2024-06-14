var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');

// Usuario predeterminado
const defaultUser = {
  username: 'admin',
  password: 'password123' // Debes hashear esta contraseña con bcrypt
};

// Hash de la contraseña predeterminada
const hashedPassword = bcrypt.hashSync(defaultUser.password, 10);

// Manejar inicio de sesión
router.post('/login', async function(req, res, next) {
    if (req.session.user) {
      // La sesión ya existe, redirigir al usuario a la página de inicio
      res.redirect('/');
    } else {
      // Crear una nueva sesión
  const { username, password } = req.body;
  if (username === defaultUser.username) {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    if (isMatch) {
      req.session.user = defaultUser;
      res.redirect('/contactos');
    } else {
      req.flash('error_msg', 'Contraseña incorrecta');
      res.redirect('/auth/login');
    }
  } else {
    req.flash('error_msg', 'Usuario no encontrado');
    res.redirect('/auth/login');
  }
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