require('reflect-metadata');

const express = require('express');
const config = require('./config/config');
const db = require('./config/db');
const routerApi = require('./routes/index.routes');

const app = express();

 // Iniciar servidor
db.initialize()
  .then(() => {
    console.log('✅ Base de datos conectada con TypeORM');
    app.listen(config.PORT, () => {
      console.log(`✅ Servidor ejecutándose en puerto ${config.PORT}`);
      console.log(`🔗 http://localhost:${config.PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Error al conectar la base de datos:', error);
  });
