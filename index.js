const express = require('express');
const { AppDataSource } = require('./config/db'); // Ajusta la ruta si index.js está dentro de src/
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(express.json());

// Inicializar la base de datos y luego levantar el servidor
AppDataSource.initialize()
  .then(() => {
    console.log('✅ Conexión a PostgreSQL y TypeORM establecida con éxito');
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Error durante la inicialización de la base de datos:', error);
  });