const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'pruebadeprogra@gmail.com',
    pass: 'Venecia21.'
  }
});

module.exports = transporter;