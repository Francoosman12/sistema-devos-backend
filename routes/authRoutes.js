const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // ✅ Importar modelo de usuario

// ✅ Ruta de Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // ✅ Validar que los campos no estén vacíos
    if (!email || !password) {
      return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }

    // ✅ Buscar usuario en la base de datos
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Usuario no encontrado." });

    // ✅ Comparar contraseña
    const isMatch = await bcrypt.compare(password, user.contrasena);
    if (!isMatch) return res.status(401).json({ message: "Contraseña incorrecta." });

    // ✅ Generar token JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ user, token });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
});

module.exports = router;