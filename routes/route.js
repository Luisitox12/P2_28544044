const express = require('express');
const router = express.Router();
const ContactosController = require('./controllers/ContactosController');

router.get('/contactos', ContactosController.index);


