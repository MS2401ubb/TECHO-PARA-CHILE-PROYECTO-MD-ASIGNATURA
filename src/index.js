const express = require('express');
const { AppDataSource } = require('./config/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT

// Middlewares globales
app.use(express.json());
const jornadaRoutes = require('./routes/jornada.routes');
app.use('/api', jornadaRoutes);

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