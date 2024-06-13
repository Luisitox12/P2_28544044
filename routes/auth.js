router.post('/login', async function(req, res, next) {
  const { username, password } = req.body;
  try {
    const user = await db.get('SELECT * FROM users WHERE username =?', [username]);
    if (!user || Object.keys(user).length === 0) {
      req.flash('error_msg', 'No user found with that username');
      return res.redirect('/auth/login');
    }
    console.log('User:', user); // Verificar que el usuario esté siendo devuelto correctamente
    if (!user.password) {
      console.error('User password is undefined');
      req.flash('error_msg', 'Something went wrong. Please try again.');
      return res.redirect('/auth/login');
    }
    console.log('User password:', user.password); // Verificar que la contraseña hasheada esté siendo devuelta correctamente
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.flash('error_msg', 'Incorrect password');
      return res.redirect('/auth/login');
    }
    //...
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Something went wrong. Please try again.');
    res.redirect('/auth/login');
  }
});