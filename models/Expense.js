const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  descripcion: { type: String, required: true },
  monto: { type: mongoose.Types.Decimal128, required: true },
  categoria: { type: String, enum: ['alquiler', 'servicios', 'sueldos', 'insumos', 'otros'], required: true },
  sucursal: { type: mongoose.Schema.Types.ObjectId, ref: 'Sucursal', required: true }, // Relación con sucursal
  realizado_por: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Relación con usuario
  fecha: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Expense', expenseSchema);