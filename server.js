const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const multer = require("multer");
const Datastore = require("nedb"); // ✅ NeDB como base de datos

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "*";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: FRONTEND_URL }));

// ✅ Base de datos NeDB
const usersDB = new Datastore({ filename: "data/users.db", autoload: true });
const productsDB = new Datastore({ filename: "data/products.db", autoload: true });

// ✅ Configuración de Multer para imágenes
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Ruta de autenticación
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  
  usersDB.findOne({ email, password }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }
    res.json({ message: "Login exitoso", token: "abc123" });
  });
});

// ✅ Ruta para registrar usuario (para pruebas)
app.post("/api/auth/register", (req, res) => {
  const { email, password, rol } = req.body;
  
  usersDB.insert({ email, password, rol }, (err, newUser) => {
    if (err) return res.status(500).json({ message: "Error al registrar usuario", err });
    res.json({ message: "Usuario creado", user: newUser });
  });
});

// ✅ Ruta para agregar productos
app.post("/api/products", async (req, res) => {
  try {
    productsDB.insert(req.body, (err, newDoc) => {
      if (err) throw err;
      res.send(newDoc);
    });
  } catch (error) {
    res.status(500).json({ message: "Error al guardar el producto", error });
  }
});

// ✅ Ruta para obtener productos
app.get("/api/products", async (req, res) => {
  try {
    productsDB.find({}, (err, docs) => {
      if (err) throw err;
      res.send(docs);
    });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener productos", error });
  }
});

// ✅ Iniciar el servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor backend corriendo en http://localhost:${PORT}`);
});