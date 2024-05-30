const ContactosModel = require("../models/ContactosModel");
const nodemailer = require ('nodemailer');
const EMAILU = process.env.EMAILU;
const EMAILP = process.env.EMAILP;
const EMAIL1 = process.env.EMAIL1;
const EMAIL2 = process.env.EMAIL2;

class ContactosController {
  constructor() {
    this.contactosModel = new ContactosModel();
    this.add = this.add.bind(this);
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAILU,
        pass: EMAILP
      }
    });
  }

   //funcion enviar correo
   enviarCorreo(email, nombre, mensaje, EMAILU, EMAIL1, EMAIL2) {
    const mailOptions = {
      from: EMAILU,
      to: [EMAIL1, EMAIL2], // Agrega más destinatarios si es necesario
      subject: 'Nuevo registro de usuario',
      text: 'Nombre: '+nombre+'\nEmail: '+email+'\nMensaje: '+mensaje
    };
    this.transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Correo enviado: ${info.response}');
      }
    });
  }
// fin funcion enviar correo



  async obtenerIp() {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip; // Retorna la ip
    } catch (error) {
      console.error('Error al obtener la ip:', error);
      return null; // Retorna null si hay un error
    }
  }

  async obtenerPais(ip) {
    try {
      const response = await fetch('https://ipinfo.io/'+ip+'?token=a3fed418af16ca');
      const data = await response.json();
      return data.country; // Retorna el país
    } catch (error) {
      console.error('Error al obtener el país:', error);
      return null; // Retorna null si hay un error
    }
  }

  
  
  async add(req, res) {
    // Validar los datos del formulario
      const { name, email, mensaje } = req.body;
  
  

    // Guardar los datos del formulario
    const ip = await this.obtenerIp();
    const fecha = new Date().toISOString();
    const pais = await this.obtenerPais(ip);

      await this.contactosModel.crearContacto(email, name, mensaje, ip, fecha, pais);

      const contactos = await this.contactosModel.obtenerAllContactos();

      await this.enviarCorreo(email, name, mensaje, EMAILU, EMAIL1, EMAIL2);
  
      console.log(contactos);
  
      // Enviar mensaje de confirmacion
      res.send("Tus Datos fueron enviados con exito, Se ha enviado un correo electrónico de confirmación.");
    }
  }

module.exports = ContactosController;