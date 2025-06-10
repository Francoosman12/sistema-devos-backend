const Datastore = require("nedb");
const path = require("path");

const db = new Datastore({
  filename: path.join(__dirname, "../config/database.db"), 
  autoload: true
});

console.log("✅ Base de datos NeDB cargada correctamente");

module.exports = db;