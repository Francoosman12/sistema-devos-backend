const Inventory = require('../models/Inventory');
const Product = require('../models/Product');
const Sucursal = require('../models/Sucursal');
const User = require('../models/User');

// Obtener todo el inventario
const getInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find().populate('producto sucursal');
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el inventario', error: error.message });
  }
};

// Registrar movimiento de inventario
const updateInventory = async (req, res) => {
  try {
    const { producto, sucursal, cantidad, tipo, realizado_por } = req.body;

    // Verificar si el producto y la sucursal existen
    const productoExistente = await Product.findById(producto);
    const sucursalExistente = await Sucursal.findById(sucursal);
    const usuarioExistente = await User.findById(realizado_por);

    if (!productoExistente || !sucursalExistente || !usuarioExistente) {
      return res.status(400).json({ message: 'Producto, sucursal o usuario no válido' });
    }

    // Buscar inventario existente
    let inventory = await Inventory.findOne({ producto, sucursal });

    if (!inventory) {
      inventory = new Inventory({ producto, sucursal, cantidad_actual: 0, historial_movimientos: [] });
    }

    // Actualizar cantidad según el tipo de movimiento
    if (tipo === 'entrada') {
      inventory.cantidad_actual += cantidad;
    } else if (tipo === 'salida') {
      if (inventory.cantidad_actual < cantidad) {
        return res.status(400).json({ message: 'Stock insuficiente' });
      }
      inventory.cantidad_actual -= cantidad;
    } else {
      return res.status(400).json({ message: 'Tipo de movimiento inválido' });
    }

    // Registrar el movimiento
    inventory.historial_movimientos.push({ tipo, cantidad, realizado_por });

    await inventory.save();
    res.status(200).json(inventory);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar inventario', error: error.message });
  }
};

module.exports = { getInventory, updateInventory };