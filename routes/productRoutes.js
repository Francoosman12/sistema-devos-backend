const express = require("express");
const {  
  getProducts,  
  getProductsBySucursal,  
  createProduct,  
  updateProduct,  
  deleteProduct,  
  uploadProductsFromExcel, // Carga masiva desde Excel
  uploadImage, // Nueva función para subir imágenes a Cloudinary
  toggleProductStatus
} = require("../controllers/productController");

const upload = require("../middlewares/upload"); // Middleware para subir archivos
const imageUpload = require("../middlewares/imageUpload"); // Middleware para subir imágenes a Cloudinary

const router = express.Router();

// ✅ Ruta para crear un nuevo producto con manejo de archivos
router.post("/", upload.single("image"), createProduct);

// ✅ Ruta para subir imágenes
router.post("/uploadImage", imageUpload.single("image"), uploadImage);

// Obtener todos los productos
router.get("/", getProducts);

// Obtener productos por sucursal
router.get("/sucursal/:sucursal", getProductsBySucursal);

// Crear un nuevo producto
router.post("/", createProduct);

// Carga masiva de productos desde Excel
router.post("/upload", upload.single("file"), uploadProductsFromExcel); // Nueva ruta

//actualizar el estado de un producto
router.put("/status/:id", toggleProductStatus);

// Actualizar un producto existente
router.put("/:id", updateProduct);

// Eliminar un producto
router.delete("/:id", deleteProduct);

module.exports = router;