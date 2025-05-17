const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  id_producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  id_vendedor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sucursal: { type: mongoose.Schema.Types.ObjectId, ref: 'Sucursal', required: true }, // Nueva relación con sucursal
  cantidad_vendida: { type: Number, required: true },
  total: { type: Number, required: true },
  metodo_pago: {
    tipo: { type: String, enum: ['tarjeta', 'efectivo', 'combinado'], required: true },
    detalles: {
      tarjeta: {
        tipo: { type: String, enum: ['credito', 'debito', 'transferencia'] },
        monto: { type: Number },
      },
      efectivo: {
        moneda: { type: String, enum: ['pesos', 'dólares', 'euros'] },
        monto: { type: Number },
      },
    },
  },
  fecha_venta: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Sale', saleSchema);