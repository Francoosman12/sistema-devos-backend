const User = require('../models/User');
const Sucursal = require('../models/Sucursal'); // Importamos el modelo de sucursal
const bcrypt = require("bcrypt");


// Obtener todos los usuarios
const getUsers = async (req, res) => {
  try {
    const users = await User.find().populate('sucursal'); // Trae la información completa de la sucursal
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
  }
};

// Crear un nuevo usuario
const createUser = async (req, res) => {
  try {
    const { nombre, email, telefono, edad, sexo, direccion, contrasena, rol, sucursal } = req.body;

    const existingUser = await User.findOne({ email });
if (existingUser) {
  return res.status(400).json({ message: "El email ya está registrado." });
}

    const sucursalExistente = await Sucursal.findById(sucursal);
    if (!sucursalExistente) {
      return res.status(400).json({ message: "La sucursal proporcionada no existe" });
    }

    // ✅ Hashear la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    const newUser = new User({
      nombre,
      email,
      telefono,
      edad,
      sexo,
      direccion,
      contrasena: hashedPassword, // ✅ Se almacena encriptada
      rol,
      sucursal,
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ message: "Error al crear usuario", error: error.message });
  }
};

// Actualizar un usuario existente
const updateUser = async (req, res) => {
  try {
    const { sucursal } = req.body;

    // Si se proporciona una nueva sucursal, verificar que exista
    if (sucursal) {
      const sucursalExistente = await Sucursal.findById(sucursal);
      if (!sucursalExistente) {
        return res.status(400).json({ message: 'La sucursal proporcionada no existe' });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('sucursal');
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar usuario', error: error.message });
  }
};

// Eliminar un usuario
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Usuario eliminado con éxito' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar usuario', error: error.message });
  }
};



// ✅ Alternar el estado activo/inactivo de un usuario
const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    user.activo = !user.activo; // ✅ Alternar estado
    await user.save();

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el estado del usuario", error: error.message });
  }
};


module.exports = { getUsers, createUser, updateUser, deleteUser, toggleUserStatus };





