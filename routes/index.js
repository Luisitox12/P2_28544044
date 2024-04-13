var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Hola Mundo', 
    name: 'Luis Augusto',
    secondname: 'Hidalgo Vasquez',
    id: '28544044',
    mat: 'Programacion 2',
    sec: 'Seccion 4',
});
});

module.exports = router;
