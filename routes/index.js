var express = require('express');
var router = express.Router();
const ContactosController = require("../controllers/ContactosController");
const contactosController = new ContactosController();

const indexController = require("../controllers/indexController")

var express = require("express");
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Curriculum', 
});
});

router.post("/form-contacto", contactosController.add);

module.exports = router;
