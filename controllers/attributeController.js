const Attribute = require("../models/Attribute");

// Obtener todos los atributos
const getAttributes = async (req, res) => {
  try {
    const attributes = await Attribute.find();
    res.json(attributes);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener atributos", error: error.message });
  }
};

// Obtener un atributo por ID
const getAttributeById = async (req, res) => {
  try {
    const attribute = await Attribute.findById(req.params.id);
    if (!attribute) {
      return res.status(404).json({ message: "Atributo no encontrado" });
    }
    res.json(attribute);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el atributo", error: error.message });
  }
};

// Crear un nuevo atributo con rubro y categoría
const createAttribute = async (req, res) => {
  try {
    const { rubro, categoria, nombre, valores } = req.body;

    // Verificar si ya existe un atributo con el mismo nombre en el mismo rubro y categoría
    const existingAttribute = await Attribute.findOne({ rubro, categoria, nombre });
    if (existingAttribute) {
      return res.status(400).json({ message: "Ya existe un atributo con este nombre en esta categoría" });
    }

    const newAttribute = new Attribute({ rubro, categoria, nombre, valores });
    const savedAttribute = await newAttribute.save();
    res.status(201).json(savedAttribute);
  } catch (error) {
    res.status(400).json({ message: "Error al crear atributo", error: error.message });
  }
};

// Actualizar un atributo existente
const updateAttribute = async (req, res) => {
  try {
    const updatedAttribute = await Attribute.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedAttribute) {
      return res.status(404).json({ message: "Atributo no encontrado" });
    }
    res.json(updatedAttribute);
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar atributo", error: error.message });
  }
};

// Eliminar un atributo
const deleteAttribute = async (req, res) => {
  try {
    const deletedAttribute = await Attribute.findByIdAndDelete(req.params.id);
    if (!deletedAttribute) {
      return res.status(404).json({ message: "Atributo no encontrado" });
    }
    res.json({ message: "Atributo eliminado con éxito" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar atributo", error: error.message });
  }
};

// Obtener categorías únicas por rubro
const getDistinctCategories = async (req, res) => {
  try {
    const { rubro } = req.query;

    if (!rubro) {
      return res.status(400).json({ message: "Debes especificar un rubro" });
    }

    const categories = await Attribute.distinct("categoria", { rubro: rubro }); // ✅ Filtramos por rubro
    res.json(categories);
  } catch (error) {
    console.error("Error en getDistinctCategories:", error);
    res.status(500).json({ message: "Error al obtener categorías", error: error.message });
  }
};

// Obtener atributos por rubro y categoría
const getAttributesByCategory = async (req, res) => {
  try {
    const { rubro, categoria } = req.query;

    if (!rubro || !categoria) {
      return res.status(400).json({ message: "Rubro y categoría son obligatorios" });
    }

    const attributes = await Attribute.find({ rubro, categoria });
    res.json(attributes);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener atributos", error: error.message });
  }
};

// Obtener rubros únicos
const getDistinctRubros = async (req, res) => {
  try {
    const rubros = await Attribute.distinct("rubro"); // ✅ Obtener rubros únicos
    res.json(rubros);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener rubros", error: error.message });
  }
};

module.exports = {
  getAttributes,
  getAttributeById,
  createAttribute,
  updateAttribute,
  deleteAttribute,
  getDistinctCategories,
  getAttributesByCategory,
  getDistinctRubros
};