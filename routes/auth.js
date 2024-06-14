var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');

const defaultUser = {
  username: process.env.USER,
  password: process.env.PASSWORD
};

const saltRounds = 10; 
const hashedPassword = bcrypt.hashSync(defaultUser.password, saltRounds);

console.log(hashedPassword);

defaultUser.password = hashedPassword;


// Página de inicio de sesión
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});


// Manejar inicio de sesión con usuario definido
router.post('/login', async function(req, res, next) {
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
});

// Manejar inicio de sesión con Google
router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: '/login'
}), (req, res) => {
  req.session.user = req.user;
  res.redirect('/contactos');
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