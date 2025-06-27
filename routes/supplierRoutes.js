const express = require('express');
const router = express.Router();
const {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier
} = require('../controllers/supplierController');

// Obtener todos los proveedores
router.get('/', getSuppliers);

// Crear proveedor
router.post('/', createSupplier);

// Actualizar proveedor por ID
router.put('/:id', updateSupplier);

// Eliminar proveedor por ID
router.delete('/:id', deleteSupplier);

module.exports = router;