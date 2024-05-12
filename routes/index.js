var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Curriculum', 
    name: 'Luis Augusto',
    secondname: 'Hidalgo',
    id: '28544044',
    mat: 'Programacion 2',
    sec: 'Seccion 4',
});
});

router.get('/form', function(req, res, next){
  res.send("Listo llamo a /form");
});
module.exports = router;
