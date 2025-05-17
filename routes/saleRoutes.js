const express = require('express');
const { getSales, createSale } = require('../controllers/saleController');
const router = express.Router();

// Obtener todas las ventas
router.get('/', getSales);

// Registrar una nueva venta
router.post('/', createSale);

module.exports = router;