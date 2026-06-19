require('reflect-metadata');
require('dotenv').config();

const express = require('express');
const config = require('./config/config');
const db = require('./config/db');

// Importación de rutas
const routerApi = require('./routes/index.routes.js').default;

const app = express();
// Uso de middlewares
app.use(express.json());
// Uso de rutas
app.use('/',routerApi);

// Configuración del puerto
const PORT = config.PORT || process.env.PORT || 3000;

// Inicializar la base de datos
db.initialize()
  .then(() => {
    console.log('✅ Base de datos conectada con TypeORM');
    app.listen(PORT, () => {
      console.log(`✅ Servidor ejecutándose en puerto ${PORT}`);
      console.log(`🔗 http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Error al conectar la base de datos:', error);
  });