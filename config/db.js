const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI); // Conexión simplificada sin opciones obsoletas
    console.log('MongoDB conectado con éxito');
  } catch (error) {
    console.error('Error de conexión:', error.message);
    process.exit(1); // Salir si falla la conexión
  }
};

module.exports = connectDB;