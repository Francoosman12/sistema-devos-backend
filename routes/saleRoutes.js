const express = require('express');
const { getSales, createSale, getSalesReport, getSalesByCategory, getKPI, getSalesBySeller } = require('../controllers/saleController'); // ✅ Importa correctamente el controlador
const router = express.Router();

router.get('/', getSales);
router.get('/report', getSalesReport);
router.get('/categorias', getSalesByCategory);
router.get('/kpi', getKPI);
router.get('/vendedores', getSalesBySeller); // ✅ Nueva ruta para ventas por vendedor

router.post('/', createSale);

module.exports = router;