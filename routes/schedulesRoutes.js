const express = require("express");
const router = express.Router();
const { getSchedules, createSchedule, updateSchedule, deleteSchedule } = require("../controllers/schedulesController");

// ✅ Obtener todos los horarios
router.get("/", getSchedules);

// ✅ Crear un nuevo horario
router.post("/", createSchedule);

// ✅ Actualizar un horario
router.put("/:id", updateSchedule);

// ✅ Eliminar un horario
router.delete("/:id", deleteSchedule);

module.exports = router;