const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  contacto: { type: String },
  telefono: { type: String },
  email: { type: String, match: [/^\S+@\S+\.\S+$/, 'Email inválido'] },
  direccion: { type: String },
  productos_suministrados: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], // Relación con productos
  fecha_creacion: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Supplier', supplierSchema);