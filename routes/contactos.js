var express = require('express');
var router = express.Router();
var db = require('../conf/database');

/* GET contactos page. */
router.get('/', function(req, res, next) {
  const query = 'SELECT email, name, mensaje, ip, fecha, pais FROM datos'; // Reemplaza 'your_table_name' con el nombre de tu tabla

  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.render('contactos', { title: 'Contactos', data: rows });
  });
});

module.exports = router;