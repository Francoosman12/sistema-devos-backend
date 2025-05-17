const express = require('express');
const router = express.Router();
const { getSucursales, getSucursalById, createSucursal, updateSucursal, deleteSucursal } = require('../controllers/sucursalController');

router.get('/', getSucursales);
router.get('/:id', getSucursalById);
router.post('/', createSucursal);
router.put('/:id', updateSucursal);
router.delete('/:id', deleteSucursal);

module.exports = router;