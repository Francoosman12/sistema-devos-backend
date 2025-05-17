const express = require("express");
const {  
  getProducts,  
  getProductsBySucursal,  
  createProduct,  
  updateProduct,  
  deleteProduct,  
  uploadProductsFromExcel, 
  uploadImage, 
  toggleProductStatus
} = require("../controllers/productController");

const upload = require("../middlewares/upload"); 
const imageUpload = require("../middlewares/imageUpload"); 

const router = express.Router();

// ✅ Obtener todos los productos
router.get("/", getProducts);

// ✅ Obtener productos por sucursal
router.get("/sucursal/:sucursal", getProductsBySucursal);

// ✅ Crear un nuevo producto con atributos dinámicos y manejo de archivos
router.post("/", upload.single("image"), createProduct);

// ✅ Carga masiva de productos desde Excel
router.post("/uploadExcel", upload.single("file"), uploadProductsFromExcel);

// ✅ Subir imágenes de productos
router.post("/uploadImage", imageUpload.single("image"), uploadImage);

// ✅ Actualizar un producto
router.put("/:id", updateProduct);

// ✅ Alternar estado activo/inactivo de un producto
router.put("/toggleStatus/:id", toggleProductStatus);

// ✅ Eliminar un producto
router.delete("/:id", deleteProduct);

module.exports = router;