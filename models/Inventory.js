const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  sucursal: { type: mongoose.Schema.Types.ObjectId, ref: 'Sucursal', required: true },
  cantidad_actual: { type: Number, required: true, min: 0 },
  historial_movimientos: [
    {
      tipo: { type: String, enum: ['entrada', 'salida'], required: true },
      cantidad: { type: Number, required: true },
      fecha: { type: Date, default: Date.now },
      realizado_por: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Relación con usuario
    }
  ],
});

module.exports = mongoose.model('Inventory', inventorySchema);