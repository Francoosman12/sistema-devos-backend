const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  rubro: { type: String, required: true }, // ✅ Guardar el rubro seleccionado
  categoria: { type: String, required: true }, // ✅ Guardar la categoría seleccionada
  atributos: [
    {
      nombre: { type: String, required: true },
      tipo: { type: String, required: true }, // ✅ Indicar si es lista, texto, número, etc.
      valor: { type: mongoose.Schema.Types.Mixed, required: true } // ✅ Guardar el valor seleccionado
    }
  ],
  precio_costo: { type: mongoose.Types.Decimal128, required: true },
  precio_publico: { type: mongoose.Types.Decimal128, required: true },
  cantidad_stock: { type: Number, required: true, min: 0 },
  sku: { type: String, unique: true },
  imagen_url: { type: String },
  descripcion: { type: String },
  fabricante: { type: String, default: 'Desconocido' },
  sucursal: { type: mongoose.Schema.Types.ObjectId, ref: 'Sucursal', required: true },
  fecha_creacion: { type: Date, default: Date.now },
  fecha_ultima_actualizacion:{type:Date, default: Date.now},
  activo: { type: Boolean, default: true },
});

// Middleware para convertir precios y generar SKU automáticamente
productSchema.pre('save', function (next) {
  if (this.precio_costo) {
    this.precio_costo = mongoose.Types.Decimal128.fromString(parseFloat(this.precio_costo).toFixed(2));
  }
  if (this.precio_publico) {
    this.precio_publico = mongoose.Types.Decimal128.fromString(parseFloat(this.precio_publico).toFixed(2));
  }

  if (!this.sku) {
    const timestamp = Date.now().toString().slice(-7);
    const randomNumbers = Math.floor(100000 + Math.random() * 900000).toString();
    this.sku = `${timestamp}${randomNumbers}`;
  }

  next();
});

module.exports = mongoose.model('Product', productSchema);