const Supplier = require("../models/Supplier");

// Obtener todos los proveedores (opcional: solo activos)
const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find().populate("productos_suministrados");
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener proveedores",
      error: error.message,
    });
  }
};

// Crear un nuevo proveedor
const createSupplier = async (req, res) => {
  try {
    const {
      nombre,
      contacto,
      telefono,
      email,
      direccion,
      tipo,
      observaciones,
      productos_suministrados,
    } = req.body;

    if (!nombre) {
      return res.status(400).json({ message: "El nombre es obligatorio." });
    }

    const newSupplier = new Supplier({
      nombre,
      contacto,
      telefono,
      email,
      direccion,
      tipo,
      observaciones,
      productos_suministrados,
      activo: true,
    });

    const savedSupplier = await newSupplier.save();
    res.status(201).json(savedSupplier);
  } catch (error) {
    res.status(400).json({
      message: "Error al registrar proveedor",
      error: error.message,
    });
  }
};

// Actualizar proveedor
const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedSupplier = await Supplier.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true, // valida email, etc.
    }).populate("productos_suministrados");

    if (!updatedSupplier) {
      return res.status(404).json({ message: "Proveedor no encontrado" });
    }

    res.json(updatedSupplier);
  } catch (error) {
    res.status(400).json({
      message: "Error al actualizar proveedor",
      error: error.message,
    });
  }
};

// Eliminar proveedor
const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Supplier.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Proveedor no encontrado" });
    }

    res.json({ message: "Proveedor eliminado correctamente" });
  } catch (error) {
    res.status(400).json({
      message: "Error al eliminar proveedor",
      error: error.message,
    });
  }
};

module.exports = {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
};