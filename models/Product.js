const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  categoria: { type: String, required: true },
  atributos: { 
    type: Map, 
    of: String, 
    default: {} 
  }, // Permite almacenar atributos dinámicos
  precio_costo: { 
    type: mongoose.Types.Decimal128, 
    required: true 
  },
  precio_publico: { 
    type: mongoose.Types.Decimal128, 
    required: true 
  },
  cantidad_stock: { 
    type: Number, 
    required: true, 
    min: [0, 'La cantidad en stock debe ser mayor o igual a 0'] 
  },
  sku: { 
    type: String, 
    unique: true 
  },
  codigo_qr_url: { type: String },
  imagen_url: { type: String },
  descripcion: { type: String },
  fabricante: { type: String, default: 'Desconocido' },
  sucursal: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Sucursal', 
    required: true 
  },
  fecha_creacion: { type: Date, default: Date.now },
  fecha_ultima_actualizacion: { type: Date, default: Date.now },
  activo: {type: Boolean, default: true},
});

// Middleware para manejar precios y SKU antes de guardar
productSchema.pre('save', function (next) {
  // Convertir precios a Decimal128 con dos decimales
  if (this.precio_costo) {
    this.precio_costo = mongoose.Types.Decimal128.fromString(parseFloat(this.precio_costo).toFixed(2));
  }
  if (this.precio_publico) {
    this.precio_publico = mongoose.Types.Decimal128.fromString(parseFloat(this.precio_publico).toFixed(2));
  }

  // Generar SKU automáticamente si no se proporciona
  if (!this.sku) {
    const timestamp = Date.now().toString().slice(-7); // Últimos 7 dígitos del timestamp
    const randomNumbers = Math.floor(100000 + Math.random() * 900000).toString(); // Generar 6 dígitos aleatorios
    this.sku = `${timestamp}${randomNumbers}`; // Concatenar timestamp + aleatorios
  }

  next();
});

module.exports = mongoose.model('Product', productSchema);