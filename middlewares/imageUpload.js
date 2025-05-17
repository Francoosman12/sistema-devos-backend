const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinaryConfig"); // Archivo de configuración de Cloudinary

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "products", // Carpeta donde se guardarán las imágenes
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage: storage });

module.exports = upload;