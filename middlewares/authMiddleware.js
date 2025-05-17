const jwt = require('jsonwebtoken');

// Verificar token de acceso
const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Acceso no autorizado' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Adjunta el usuario decodificado al objeto de la solicitud
    next();
  } catch (error) {
    res.status(403).json({ message: 'Token inválido' });
  }
};

module.exports = { authenticateUser };