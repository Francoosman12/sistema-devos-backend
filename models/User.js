const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Email inválido"],
  },
  telefono: {
    type: String,
    required: true,
    match: [/^\d{10}$/, "Número de teléfono inválido"],
  },
  edad: {
    type: Number,
    min: [18, "Debe ser mayor de edad"],
    max: [120, "Edad no válida"],
  },
  sexo: { type: String, enum: ["masculino", "femenino", "otro"] },
  direccion: { type: String },
  contrasena: {
    type: String,
    required: true,
    minlength: [6, "La contraseña debe tener al menos 6 caracteres"],
  },
  rol: { type: String, enum: ["vendedor", "administrador"], default: "vendedor" },
  sucursal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sucursal",
    required: true,
  },
  activo: { type: Boolean, default: true }, // ✅ Nuevo campo para activar/inactivar usuarios
  fecha_creacion: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);