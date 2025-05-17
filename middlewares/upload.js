const multer = require('multer');

// Configuración de almacenamiento
const storage = multer.memoryStorage(); // Guarda el archivo en memoria
const upload = multer({ storage });

module.exports = upload;