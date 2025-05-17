const Supplier = require('../models/Supplier');
const Product = require('../models/Product');

// Obtener todos los proveedores
const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find().populate('productos_suministrados');
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener proveedores', error: error.message });
  }
};

// Crear un nuevo proveedor
const createSupplier = async (req, res) => {
  try {
    const { nombre, contacto, telefono, email, direccion, productos_suministrados } = req.body;

    const newSupplier = new Supplier({
      nombre,
      contacto,
      telefono,
      email,
      direccion,
      productos_suministrados,
    });

    const savedSupplier = await newSupplier.save();
    res.status(201).json(savedSupplier);
  } catch (error) {
    res.status(400).json({ message: 'Error al registrar proveedor', error: error.message });
  }
};

module.exports = { getSuppliers, createSupplier };