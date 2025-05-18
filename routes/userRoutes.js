const express = require('express');
const { getUsers, createUser, updateUser, deleteUser, toggleUserStatus } = require('../controllers/userController');
// const { authenticateUser } = require('../middlewares/authMiddleware');
// const { verifyRole } = require('../middlewares/roleMiddleware');
const router = express.Router();

// Obtener todos los usuarios
router.get('/', getUsers);

// Crear un nuevo usuario
router.post('/', createUser);

// Actualizar un usuario existente
router.put('/:id', updateUser);

// Eliminar un usuario
router.delete('/:id', deleteUser);

//Definir la ruta para alternar el estado de un usuario
router.put("/:id/status", toggleUserStatus);

module.exports = router;