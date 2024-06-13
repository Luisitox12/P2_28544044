const express = require('express');
const router = express.Router();
const db = require('../database');
const bcrypt = require('bcrypt');
const flash = require('connect-flash');
const session = require('express-session');

router.use(session({
  secret: 'mysecret',
  resave: false,
  saveUninitialized: false
}));

router.use(flash());

router.get('/login', function(req, res, next) {
  res.render('login', {
    title: 'Login',
    error_msg: req.flash('error_msg')
  });
});

router.post('/login', async function(req, res, next) {
  const { username, password } = req.body;
  try {
    const user = await db.get('SELECT * FROM users WHERE username =?', [username]);
    if (!user || Object.keys(user).length === 0) {
      req.flash('error_msg', 'No user found with that username');
      return res.redirect('/auth/login');
    }
    console.log('User:', user);
    if (!user.password) {
      console.error('User password is undefined');
      req.flash('error_msg', 'Something went wrong. Please try again.');
      return res.redirect('/auth/login');
    }
    console.log('User password:', user.password);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.flash('error_msg', 'Incorrect password');
      return res.redirect('/auth/login');
    }
    req.session.user = user;
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Something went wrong. Please try again.');
    res.redirect('/auth/login');
  }
});

router.get('/register', function(req, res, next) {
  res.render('register', {
    title: 'Register',
    error_msg: req.flash('error_msg')
  });
});

router.post('/register', async function(req, res, next) {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.run('INSERT INTO users (username, password) VALUES (?,?)', [username, hashedPassword]);
    req.flash('success_msg', 'Registration successful. Please login.');
    res.redirect('/auth/login');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Something went wrong. Please try again.');
    res.redirect('/auth/register');
  }
});

module.exports = router;