//INICIALIZACION

import express from 'express';
//import config
//import db
import {usuarioRoutes} from './routes/Usuario.routes.js';
import {encargadoVoluntariosRoutes} from './routes/EncargadoVoluntarios.routes.js';
import {cuadrillaRoutes} from './routes/Cuadrilla.routes.js';

const app = express();

app.use(express.json());

//RUTAS

app.use('/Usuario',usuarioRoutes);
app.use('/AdministracionVoluntarios',encargadoVoluntariosRoutes);
app.use('/Cuadrillas',cuadrillaRoutes);

export default app;
