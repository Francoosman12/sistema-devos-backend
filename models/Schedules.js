const mongoose = require("mongoose");

const ScheduleSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // ✅ Relación con usuarios
  fechaInicio: { type: Date, required: true }, // ✅ Fecha de inicio del horario
  fechaFin: { type: Date, required: true }, // ✅ Fecha de fin del horario
  tipoPeriodo: { type: String, enum: ["diario", "semanal", "mensual"], required: true }, // ✅ Tipo de periodo
  horaEntrada: { type: String, required: true }, // ✅ Hora de entrada
  horaSalida: { type: String, required: true }, // ✅ Hora de salida
  zonaHoraria: { type: String, required: true }, // ✅ Zona horaria del empleado
}, { timestamps: true }); // ✅ Agregar marcas de tiempo automáticas (createdAt y updatedAt)

module.exports = mongoose.model("Schedule", ScheduleSchema);