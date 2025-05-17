const express = require('express');
const router = express.Router();
const { getInventory, updateInventory } = require('../controllers/inventoryController');

router.get('/', getInventory);
router.post('/update', updateInventory);

module.exports = router;