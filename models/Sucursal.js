const mongoose = require('mongoose');

const sucursalSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true }, // Nombre único para evitar duplicados
  direccion: { type: String },
  telefono: { type: String },
  horario_atencion: { type: String },
  fecha_creacion: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Sucursal', sucursalSchema);