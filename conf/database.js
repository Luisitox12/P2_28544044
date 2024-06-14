const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Función para obtener todos los contactos de la tabla contactos
db.getAllContacts = function(callback) {
    db.all('SELECT * FROM contactos', function(err, rows) {
      if (err) {
        console.error('Error al obtener los contactos', err);
        callback(err, null);
      } else {
        callback(null, rows);
      }
    });
  };