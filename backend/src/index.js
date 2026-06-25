import 'reflect-metadata';
import express from 'express';
import { routerApi } from './routes/index.routes.js';
import db from './config/configDb.js';
import {  createInitialRegionesAndCiudades,
          createInitialUsuarios,
          createInitialViviendas,
          createInitialCuadrillas,
          createInitialJornadas,
          createInitialMateriales,
          createInitialRelations
        } from './config/initialSetup.js';
import { PORT } from './config/configEnv.js';

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Bienvenido al sistema de TECHO");
});

// Rutas globales
routerApi(app);

// Inicialización asíncrona global
try {
  console.log('⏳ Conectando a la base de datos...');
  await db.initialize();
  console.log('✅ Base de datos conectada con TypeORM');

  console.log('⏳ Cargando datos iniciales...');
  await createInitialRegionesAndCiudades();
  await createInitialUsuarios();
  await createInitialViviendas();
  await createInitialCuadrillas();
  await createInitialJornadas();
  await createInitialMateriales();
  await createInitialRelations();
  console.log('✅ Datos Cargados con éxito.');

  // Encender el servidor una vez que todo está listo
  app.listen(PORT || 3000, () => {
    console.log(`✅ Servidor ejecutándose en puerto ${PORT}`);
    console.log(`🔗 http://localhost:${PORT}`);
  });

} catch (error) {
  console.error('❌ Error crítico durante el inicio del sistema:', error);
  process.exit(1);
}