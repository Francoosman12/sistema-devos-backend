const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },

    contacto: { type: String }, // Persona de contacto o representante

    telefono: { type: String }, // Puede incluir validación con regex si querés

    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true,
      match: [/^\S+@\S+\.\S+$/, "Email inválido"],
    },

    direccion: { type: String },

    tipo: {
      type: String,
      enum: ["insumos", "logística", "tecnología", "servicio", "otro"],
      default: "otro",
    },

    observaciones: { type: String },

    productos_suministrados: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    ],

    activo: { type: Boolean, default: true },

    fecha_creacion: { type: Date, default: Date.now },
  },
  {
    timestamps: true, // ✅ Agrega createdAt y updatedAt automáticamente
  }
);

module.exports = mongoose.model("Supplier", supplierSchema);