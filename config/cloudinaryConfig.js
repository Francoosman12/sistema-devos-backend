require("dotenv").config(); // Carga las variables de entorno
const cloudinary = require("cloudinary").v2;

// Configuración automática desde CLOUDINARY_URL
cloudinary.config(process.env.CLOUDINARY_URL);

module.exports = cloudinary;