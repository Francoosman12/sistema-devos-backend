const Expense = require('../models/Expense');
const Sucursal = require('../models/Sucursal');
const User = require('../models/User');

// Obtener todos los gastos
const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().populate('sucursal realizado_por');
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener gastos', error: error.message });
  }
};

// Registrar un nuevo gasto
const createExpense = async (req, res) => {
  try {
    const { descripcion, monto, categoria, sucursal, realizado_por } = req.body;

    // Verificar si la sucursal y el usuario existen
    const sucursalExistente = await Sucursal.findById(sucursal);
    const usuarioExistente = await User.findById(realizado_por);

    if (!sucursalExistente || !usuarioExistente) {
      return res.status(400).json({ message: 'Sucursal o usuario no válido' });
    }

    const newExpense = new Expense({
      descripcion,
      monto,
      categoria,
      sucursal,
      realizado_por,
    });

    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (error) {
    res.status(400).json({ message: 'Error al registrar gasto', error: error.message });
  }
};

module.exports = { getExpenses, createExpense };