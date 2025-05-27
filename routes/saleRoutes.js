const express = require('express');
const { getSales, createSale, getSalesReport } = require('../controllers/saleController'); // ✅ Importa correctamente el controlador
const router = express.Router();

// Obtener todas las ventas
router.get('/', getSales);

// Obtener reporte de ventas por categoría
router.get('/report', getSalesReport); // ✅ Asegura que la ruta está registrada

// Registrar una nueva venta
router.post('/', createSale);

module.exports = router;