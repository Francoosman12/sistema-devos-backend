const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  tipo: { type: String, enum: ['ventas', 'inventario', 'finanzas'], required: true },
  sucursal: { type: mongoose.Schema.Types.ObjectId, ref: 'Sucursal' }, // Relación con sucursal
  fecha_inicio: { type: Date, required: true },
  fecha_fin: { type: Date, required: true },
  datos: { type: Object, required: true }, // Aquí se almacenan los datos del reporte
  generado_por: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Relación con usuario
  fecha_creacion: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Report', reportSchema);