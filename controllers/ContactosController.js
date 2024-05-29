const ContactosModel = require("../models/ContactosModel");
const nodemailer = require('nodemailer');

class ContactosController {
  constructor() {
    this.contactosModel = new ContactosModel();
    this.add = this.add.bind(this);
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'pruebadeprogra@gmail.com',
        pass: 'Venecia21.'
      }
    });
  }

  //funcion enviar correo
  enviarCorreo(email, nombre, mensaje) {
    const mailOptions = {
      from: 'pruebadeprogra@gmail.com',
      to: 'luishidalgops6@gmail.com', // Agrega más destinatarios si es necesario
      subject: 'Nuevo registro de usuario',
      text: `Nombre: ${nombre}\nEmail: ${email}\nMensaje: ${mensaje}`
    };
  
    this.transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log(`Correo enviado: ${info.response}`);
      }
    });
  }
// fin funcion enviar correo

  async add(req, res) {
    // Validar los datos del formulario

    const { email, name, mensaje } = req.body;

    if (!email || !name || !mensaje) {
      res.status(400).send("Faltan campos requeridos");
      return;
    }

    // Guardar los datos del formulario
    const ip = req.ip;
    const fecha = new Date().toISOString();

   
    try {
      await this.contactosModel.crearContacto(email, name, mensaje, ip, fecha);
      this.enviarCorreo(email, name, mensaje);
      res.status(200).send("Tus datos se han enviado correctamente.");
    } catch (error) {
      res.status(500).send("Ha ocurrido un error al procesar tus datos.");
    }
  }
}

module.exports = ContactosController;