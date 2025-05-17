const mongoose = require('mongoose');
const Sale = require('../models/Sale');
const Product = require('../models/Product');
const User = require('../models/User');
const Sucursal = require('../models/Sucursal');

// Obtener todas las ventas
const getSales = async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate('id_producto')
      .populate('id_vendedor')
      .populate('sucursal');

    // Convertir el total a formato numérico con separadores de miles
    const formattedSales = sales.map(sale => ({
      ...sale._doc,
      total: new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'ARS' }).format(parseFloat(sale.total.toString())),
    }));

    res.json(formattedSales);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener ventas', error: error.message });
  }
};

// Crear una nueva venta
const createSale = async (req, res) => {
  try {
    const { id_producto, id_vendedor, sucursal, cantidad_vendida, total, metodo_pago } = req.body;

    // Verificar si el producto existe
    const productoExistente = await Product.findById(id_producto);
    if (!productoExistente) {
      return res.status(400).json({ message: 'El producto proporcionado no existe' });
    }

    // Verificar si el vendedor existe
    const vendedorExistente = await User.findById(id_vendedor);
    if (!vendedorExistente) {
      return res.status(400).json({ message: 'El vendedor proporcionado no existe' });
    }

    // Verificar si la sucursal existe
    const sucursalExistente = await Sucursal.findById(sucursal);
    if (!sucursalExistente) {
      return res.status(400).json({ message: 'La sucursal proporcionada no existe' });
    }

    // Convertir el total a Decimal128 antes de guardar
    const newSale = new Sale({
      id_producto,
      id_vendedor,
      sucursal,
      cantidad_vendida,
      total: mongoose.Types.Decimal128.fromString(parseFloat(total).toFixed(2)), // Convertir a Decimal128
      metodo_pago,
    });

    const savedSale = await newSale.save();
    res.status(201).json(savedSale);
  } catch (error) {
    res.status(400).json({ message: 'Error al registrar la venta', error: error.message });
  }
};

module.exports = { getSales, createSale };