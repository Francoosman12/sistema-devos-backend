// Verificar rol de usuario (vendedor o administrador)
const verifyRole = (role) => {
    return (req, res, next) => {
      if (req.user.rol !== role) {
        return res.status(403).json({ message: 'No tienes permisos para realizar esta acción' });
      }
      next();
    };
  };
  
  module.exports = { verifyRole };