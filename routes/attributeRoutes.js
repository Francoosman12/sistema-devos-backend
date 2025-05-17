const express = require("express");
const {
  getAttributes,
  getAttributeById,
  createAttribute,
  updateAttribute,
  deleteAttribute,
  getDistinctCategories,
  getDistinctRubros
  
} = require("../controllers/attributeController");

const router = express.Router();

router.get("/distinctRubros", getDistinctRubros);

router.get("/distinctCategories", getDistinctCategories);

// Obtener todos los atributos
router.get("/", getAttributes);

// Obtener un atributo por ID
router.get("/:id", getAttributeById);

// Crear un nuevo atributo
router.post("/", createAttribute);

// Actualizar un atributo existente
router.put("/:id", updateAttribute);

// Eliminar un atributo
router.delete("/:id", deleteAttribute);


module.exports = router;