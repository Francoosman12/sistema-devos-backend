const mongoose = require("mongoose");
const Settings = require("../models/Settings"); // ✅ Importar configuración global

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
  sku: { type: String, unique: true }, // ✅ Puede ser manual o generado automáticamente
  imagen_url: { type: String },
  descripcion: { type: String },
  fabricante: { type: String, default: "Desconocido" },
  sucursal: { type: mongoose.Schema.Types.ObjectId, ref: "Sucursal", required: true },
  fecha_creacion: { type: Date, default: Date.now },
  fecha_ultima_actualizacion: { type: Date, default: Date.now },
  activo: { type: Boolean, default: true },
 fecha_vencimiento: {
  type: Date,
  required: false,
  validate: {
    validator: function (value) {
      return value instanceof Date && !isNaN(value.getTime()); // ✅ Asegurar que sea una fecha válida
    },
    message: "⚠️ Fecha de vencimiento inválida.",
  },
},
});

// ✅ Middleware para convertir precios y generar SKU según la configuración
productSchema.pre("save", async function (next) {
  // ✅ Convertir precios a Decimal128
  if (this.precio_costo) {
    this.precio_costo = mongoose.Types.Decimal128.fromString(parseFloat(this.precio_costo).toFixed(2));
  }
  if (this.precio_publico) {
    this.precio_publico = mongoose.Types.Decimal128.fromString(parseFloat(this.precio_publico).toFixed(2));
  }

  // ✅ Solo generar SKU automáticamente si la configuración lo permite
  if (!this.sku) {
    const settings = await Settings.findOne();
    if (settings && settings.autoGenerateSKU) {
      let skuGenerado;
      let skuExiste = true;

      while (skuExiste) {
        skuGenerado = Math.floor(1000000000000 + Math.random() * 9000000000000).toString(); // ✅ Generar un número de 13 dígitos
        skuExiste = await Product.exists({ sku: skuGenerado }); // ✅ Verificar que sea único en la base de datos
      }

      this.sku = skuGenerado;
    }
  }

  next();
});

module.exports = mongoose.model("Product", productSchema);