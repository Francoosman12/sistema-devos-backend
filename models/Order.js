const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Relación con usuario
  sucursal: { type: mongoose.Schema.Types.ObjectId, ref: 'Sucursal', required: true }, // Relación con sucursal
  productos: [
    {
      producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // Relación con producto
      cantidad: { type: Number, required: true },
      precio_unitario: { type: mongoose.Types.Decimal128, required: true },
    }
  ],
  total: { type: mongoose.Types.Decimal128, required: true },
  estado: { type: String, enum: ['pendiente', 'procesando', 'enviado', 'entregado'], default: 'pendiente' },
  fecha_pedido: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);