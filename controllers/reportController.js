const Report = require('../models/Report');
const User = require('../models/User');
const Sucursal = require('../models/Sucursal');

// Obtener todos los reportes
const getReports = async (req, res) => {
  try {
    const reports = await Report.find().populate('sucursal generado_por');
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener reportes', error: error.message });
  }
};

// Crear un nuevo reporte
const createReport = async (req, res) => {
  try {
    const { tipo, sucursal, fecha_inicio, fecha_fin, datos, generado_por } = req.body;

    // Verificar si el usuario y la sucursal existen
    const usuarioExistente = await User.findById(generado_por);
    const sucursalExistente = sucursal ? await Sucursal.findById(sucursal) : null;

    if (!usuarioExistente || (sucursal && !sucursalExistente)) {
      return res.status(400).json({ message: 'Usuario o sucursal no válido' });
    }

    const newReport = new Report({
      tipo,
      sucursal,
      fecha_inicio,
      fecha_fin,
      datos,
      generado_por,
    });

    const savedReport = await newReport.save();
    res.status(201).json(savedReport);
  } catch (error) {
    res.status(400).json({ message: 'Error al generar reporte', error: error.message });
  }
};

module.exports = { getReports, createReport };