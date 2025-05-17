const Sucursal = require('../models/Sucursal');

// Obtener todas las sucursales
const getSucursales = async (req, res) => {
  try {
    const sucursales = await Sucursal.find();
    res.json(sucursales);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener sucursales', error: error.message });
  }
};

// Obtener una sucursal por ID
const getSucursalById = async (req, res) => {
  try {
    const sucursal = await Sucursal.findById(req.params.id);
    if (!sucursal) {
      return res.status(404).json({ message: 'Sucursal no encontrada' });
    }
    res.json(sucursal);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la sucursal', error: error.message });
  }
};

// Crear una nueva sucursal
const createSucursal = async (req, res) => {
  try {
    const { nombre, direccion, telefono, horario_atencion } = req.body;

    // Verificar si ya existe una sucursal con el mismo nombre
    const sucursalExistente = await Sucursal.findOne({ nombre });
    if (sucursalExistente) {
      return res.status(400).json({ message: 'Ya existe una sucursal con este nombre' });
    }

    const newSucursal = new Sucursal({
      nombre,
      direccion,
      telefono,
      horario_atencion,
    });

    const savedSucursal = await newSucursal.save();
    res.status(201).json(savedSucursal);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear sucursal', error: error.message });
  }
};

// Actualizar una sucursal existente
const updateSucursal = async (req, res) => {
  try {
    const updatedSucursal = await Sucursal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedSucursal) {
      return res.status(404).json({ message: 'Sucursal no encontrada' });
    }
    res.json(updatedSucursal);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar sucursal', error: error.message });
  }
};

// Eliminar una sucursal
const deleteSucursal = async (req, res) => {
  try {
    const deletedSucursal = await Sucursal.findByIdAndDelete(req.params.id);
    if (!deletedSucursal) {
      return res.status(404).json({ message: 'Sucursal no encontrada' });
    }
    res.json({ message: 'Sucursal eliminada con éxito' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar sucursal', error: error.message });
  }
};

module.exports = { 
  getSucursales, 
  getSucursalById, 
  createSucursal, 
  updateSucursal, 
  deleteSucursal 
};