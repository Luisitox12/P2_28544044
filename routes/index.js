var express = require("express");
var router = express.Router();

const ContactosController = require("../controllers/ContactosController");
const contactosController = new ContactosController();

const indexController = require("../controllers/indexController.js")


/* GET home page. */
router.get("/", indexController);

router.post("/form-contacto", contactosController.add);

module.exports = router;
