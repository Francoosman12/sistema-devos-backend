const mongoose = require("mongoose");

const attributeSchema = new mongoose.Schema({
  rubro: { type: String, required: true }, // ✅ Ejemplo: "Ropa", "Electrónica"
  categoria: { type: String, required: true }, // ✅ Ejemplo: "Pantalón", "Celulares"
  nombre: { type: String, required: true }, // ✅ Ejemplo: "Color", "Talle"
  valores: [{ type: String, required: true }], // ✅ Lista de opciones
  fecha_creacion: { type: Date, default: Date.now }, // Fecha de registro
});

module.exports = mongoose.model("Attribute", attributeSchema);