const Schedule = require("../models/schedules");
const User = require("../models/User");

// ✅ Obtener todos los horarios
const getSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find().populate("usuario", "nombre email"); // ✅ Traer datos básicos del usuario
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los horarios." });
  }
};

// ✅ Crear un nuevo horario
const createSchedule = async (req, res) => {
  try {
    const { usuario, fechaInicio, fechaFin, tipoPeriodo, horaEntrada, horaSalida, zonaHoraria } = req.body;

    // ✅ Validar que el usuario existe
    const userExists = await User.findById(usuario);
    if (!userExists) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    const nuevoHorario = new Schedule({ usuario, fechaInicio, fechaFin, tipoPeriodo, horaEntrada, horaSalida, zonaHoraria });
    await nuevoHorario.save();
    res.status(201).json(nuevoHorario);
  } catch (error) {
    res.status(400).json({ error: "Error al crear el horario." });
  }
};

// ✅ Actualizar un horario
const updateSchedule = async (req, res) => {
  try {
    const horarioActualizado = await Schedule.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(horarioActualizado);
  } catch (error) {
    res.status(400).json({ error: "Error al actualizar el horario." });
  }
};

// ✅ Eliminar un horario
const deleteSchedule = async (req, res) => {
  try {
    await Schedule.findByIdAndDelete(req.params.id);
    res.json({ message: "Horario eliminado correctamente." });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el horario." });
  }
};

module.exports = { getSchedules, createSchedule, updateSchedule, deleteSchedule };