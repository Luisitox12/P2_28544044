var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');

const defaultUser = {
  username: 'admin',
  password: 'password123'
};

const saltRounds = 10; // número de rondas de hash
const hashedPassword = bcrypt.hashSync(defaultUser.password, saltRounds);

console.log(hashedPassword); // salida: $2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi

defaultUser.password = hashedPassword;


// Página de inicio de sesión
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});


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