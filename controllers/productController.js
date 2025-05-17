const mongoose = require('mongoose');
const Product = require('../models/Product');
const Sucursal = require('../models/Sucursal');
const xlsx = require('xlsx');
const cloudinary = require("../config/cloudinaryConfig"); // ✅ Importa tu configuración de Cloudinary

// Obtener todos los productos
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('sucursal');

    // Convertir precios a formato numérico con separadores de miles
    const formattedProducts = products.map(product => ({
      ...product._doc,
      precio_costo: new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'ARS' }).format(parseFloat(product.precio_costo.toString())),
      precio_publico: new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'ARS' }).format(parseFloat(product.precio_publico.toString())),
    }));

    res.json(formattedProducts);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener productos', error: error.message });
  }
};

// Obtener productos por sucursal
const getProductsBySucursal = async (req, res) => {
  try {
    const { sucursal } = req.params;

    // Verificar si la sucursal existe
    const sucursalExistente = await Sucursal.findById(sucursal);
    if (!sucursalExistente) {
      return res.status(400).json({ message: 'La sucursal proporcionada no existe' });
    }

    const products = await Product.find({ sucursal }).populate('sucursal');
    if (products.length === 0) {
      return res.status(404).json({ message: 'No se encontraron productos para esta sucursal' });
    }

    // Convertir precios a formato numérico con separadores de miles
    const formattedProducts = products.map(product => ({
      ...product._doc,
      precio_costo: new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'ARS' }).format(parseFloat(product.precio_costo.toString())),
      precio_publico: new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'ARS' }).format(parseFloat(product.precio_publico.toString())),
    }));

    res.json(formattedProducts);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener productos por sucursal', error: error.message });
  }
};

// Crear un nuevo producto
const createProduct = async (req, res) => {
  try {
    console.log("✅ req.body recibido:", req.body);
    console.log("✅ req.file recibido:", req.file);

    if (!req.body.nombre) {
      return res.status(400).json({ message: "Faltan datos obligatorios." });
    }

    // ✅ Procesar atributos correctamente
    const atributosFinales = typeof req.body.atributos === "string" 
      ? JSON.parse(req.body.atributos) 
      : req.body.atributos;

    // ✅ Subir imagen a Cloudinary
    let imagen_url = "";
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "products" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      imagen_url = result.secure_url;
      console.log("✅ Imagen subida a Cloudinary:", imagen_url);
    }

    // ✅ Crear el producto con la imagen subida
    const newProduct = new Product({
      nombre: req.body.nombre,
      categoria: req.body.categoria,
      atributos: atributosFinales,
      precio_costo: parseFloat(req.body.precio_costo).toFixed(2),
      precio_publico: parseFloat(req.body.precio_publico).toFixed(2),
      cantidad_stock: req.body.cantidad_stock,
      fabricante: req.body.fabricante || "Desconocido",
      sucursal: req.body.sucursal,
      imagen_url,
    });

    const savedProduct = await newProduct.save();
    console.log("✅ Producto guardado con imagen:", savedProduct);

    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("❌ Error al crear producto:", error.message);
    res.status(400).json({ message: "Error al crear producto", error: error.message });
  }
};

// Actualizar un producto existente
const updateProduct = async (req, res) => {
  try {
    const { sucursal, precio_costo, precio_publico } = req.body;

    // Si se proporciona una nueva sucursal, verificar que exista
    if (sucursal) {
      const sucursalExistente = await Sucursal.findById(sucursal);
      if (!sucursalExistente) {
        return res.status(400).json({ message: 'La sucursal proporcionada no existe' });
      }
    }

    // Convertir precios a Decimal128 si se proporcionan
    if (precio_costo) {
      req.body.precio_costo = mongoose.Types.Decimal128.fromString(parseFloat(precio_costo).toFixed(2));
    }
    if (precio_publico) {
      req.body.precio_publico = mongoose.Types.Decimal128.fromString(parseFloat(precio_publico).toFixed(2));
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('sucursal');
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar producto', error: error.message });
  }
};

// Eliminar un producto
const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Producto eliminado con éxito' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar producto', error: error.message });
  }
};

// Cargar productos desde Excel
const uploadProductsFromExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se ha subido ningún archivo' });
    }

    // Leer el archivo Excel
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0]; // Tomar la primera hoja
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]); // Convertir a JSON

    // Definir columnas obligatorias (las que no son atributos)
    const columnasObligatorias = ['nombre', 'categoria', 'precio_costo', 'precio_publico', 'cantidad_stock', 'fabricante', 'sucursal'];

    // Validar y procesar los productos
    const productosProcesados = [];
    for (const item of data) {
      const { nombre, categoria, precio_costo, precio_publico, cantidad_stock, fabricante, sucursal } = item;

      // Verificar si la sucursal existe
      const sucursalExistente = await Sucursal.findOne({ nombre: sucursal });
      if (!sucursalExistente) {
        return res.status(400).json({ message: `La sucursal ${sucursal} no existe` });
      }

      // Detectar atributos dinámicos (todas las columnas que no sean obligatorias)
      const atributos = {};
      Object.keys(item).forEach(columna => {
        if (!columnasObligatorias.includes(columna)) {
          atributos[columna] = item[columna]; // Guardar atributo dinámico
        }
      });

      // Crear el producto sin imagen (se agregará después)
      const newProduct = new Product({
        nombre,
        categoria,
        atributos, // Ahora los atributos se generan automáticamente
        precio_costo: mongoose.Types.Decimal128.fromString(parseFloat(precio_costo).toFixed(2)),
        precio_publico: mongoose.Types.Decimal128.fromString(parseFloat(precio_publico).toFixed(2)),
        cantidad_stock,
        fabricante,
        sucursal: sucursalExistente._id,
      });

      productosProcesados.push(newProduct);
    }

    // Guardar los productos en la base de datos
    await Product.insertMany(productosProcesados);
    res.status(201).json({ message: 'Productos cargados exitosamente', productos: productosProcesados });
  } catch (error) {
    res.status(500).json({ message: 'Error al procesar el archivo', error: error.message });
  }
};

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No se ha subido ninguna imagen" });
    }

    const imageUrl = req.file.path; // ✅ Cloudinary genera automáticamente la URL de la imagen
    res.json({ imageUrl });
  } catch (error) {
    res.status(500).json({ message: "Error al subir imagen", error: error.message });
  }
};

const toggleProductStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { activo } = req.body; // ✅ Recibir el nuevo estado desde el frontend

    // Actualizar el estado `activo` en la base de datos
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { activo },
      { new: true }
    );

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el estado del producto", error: error.message });
  }
};

module.exports = {  
  getProducts,  
  getProductsBySucursal,  
  createProduct,  
  updateProduct,  
  deleteProduct,  
  uploadProductsFromExcel, // Nueva función para carga masiva
  uploadImage,
  toggleProductStatus
};