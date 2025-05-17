const Order = require('../models/Order');
const User = require('../models/User');
const Sucursal = require('../models/Sucursal');
const Product = require('../models/Product');

// Obtener todos los pedidos
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('cliente sucursal productos.producto');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener pedidos', error: error.message });
  }
};

// Crear un nuevo pedido
const createOrder = async (req, res) => {
  try {
    const { cliente, sucursal, productos, total } = req.body;

    // Verificar si el cliente y la sucursal existen
    const clienteExistente = await User.findById(cliente);
    const sucursalExistente = await Sucursal.findById(sucursal);

    if (!clienteExistente || !sucursalExistente) {
      return res.status(400).json({ message: 'Cliente o sucursal no válido' });
    }

    const newOrder = new Order({
      cliente,
      sucursal,
      productos,
      total,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ message: 'Error al registrar pedido', error: error.message });
  }
};

module.exports = { getOrders, createOrder };