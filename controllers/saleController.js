const mongoose = require('mongoose');
const Sale = require('../models/Sale');
const Product = require('../models/Product');
const User = require('../models/User');
const Sucursal = require('../models/Sucursal');

// Obtener todas las ventas
const getSales = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query; // ✅ Obtener fechas desde la solicitud

    const filtro = {};
    if (fechaInicio && fechaFin) {
      filtro.fecha_venta = { $gte: new Date(fechaInicio), $lte: new Date(fechaFin) }; // ✅ Filtrar por rango de fechas
    }

    const sales = await Sale.find(filtro)
      .populate("id_vendedor")
      .populate("sucursal")
      .populate("productos.id_producto"); // ✅ Corregido para acceder a los productos dentro del array

    // ✅ Convertir el total al formato de moneda correctamente
    const formattedSales = sales.map(sale => ({
      ...sale._doc,
      total: new Intl.NumberFormat("es-ES", { style: "currency", currency: "ARS" }).format(parseFloat(sale.total.toString())),
    }));

    res.json(formattedSales);
  } catch (error) {
    console.error("❌ Error al obtener ventas:", error);
    res.status(500).json({ message: "Error al obtener ventas", error: error.message });
  }
};

const getSalesReport = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;

    console.log("📌 Buscando ventas entre:", fechaInicio, "y", fechaFin);

    const ventas = await Sale.find({
      fecha_venta: {
        $gte: new Date(fechaInicio), // ✅ Convierte correctamente a `Date`
        $lte: new Date(fechaFin)
      }
    }).populate("id_vendedor").populate("sucursal").populate("productos.id_producto");

    console.log("📌 Ventas encontradas:", ventas);

    res.json(ventas);
  } catch (error) {
    console.error("❌ Error al obtener ventas:", error);
    res.status(500).json({ message: "Error en el reporte de ventas", error: error.message });
  }
};

// Crear una nueva venta
const createSale = async (req, res) => {
  try {
    console.log("🛒 Datos recibidos en el backend:", req.body);

    const { id_vendedor, sucursal, productos, total, metodo_pago } = req.body;

    if (!id_vendedor || !sucursal || !productos || productos.length === 0 || !total || !metodo_pago) {
      return res.status(400).json({ message: "Faltan datos en la solicitud de venta." });
    }

    // Verificar existencia y stock de productos
    for (const item of productos) {
      const productoExistente = await Product.findById(item.id_producto);
      if (!productoExistente) {
        return res.status(400).json({ message: `El producto con ID ${item.id_producto} no existe` });
      }
      if (productoExistente.cantidad_stock < item.cantidad_vendida) {
        return res.status(400).json({ message: `Stock insuficiente para ${productoExistente.nombre}` });
      }
    }

    // Registrar la venta
    const newSale = new Sale({
      id_vendedor,
      sucursal,
      productos,
      cantidad_vendida: productos.reduce((sum, item) => sum + item.cantidad_vendida, 0),
      total: mongoose.Types.Decimal128.fromString(total.toString()),
      metodo_pago,
    });

    const savedSale = await newSale.save();

    // **Restar stock a los productos vendidos**
    for (const item of productos) {
      await Product.findByIdAndUpdate(item.id_producto, {
        $inc: { cantidad_stock: -item.cantidad_vendida },
      });
    }

    res.status(201).json(savedSale);
  } catch (error) {
    res.status(400).json({ message: "Error al registrar la venta", error: error.message });
  }
};

module.exports = { getSales,getSalesReport, createSale };