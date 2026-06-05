const express = require('express')
const router = express.Router();
const encargadoCentralRoutes = require('./encargadoCentral.routes');

import usuarioRoutes from './Usuario.routes.js';
import encargadoVoluntariosRoutes from './EncargadoVoluntarios.routes.js';
import cuadrillaRoutes from './Cuadrilla/Cuadrilla.routes.js';

router.use('/', encargadoCentralRoutes); //?
router.use('/Usuario',usuarioRoutes);
router.use('/AdministracionVoluntarios',encargadoVoluntariosRoutes);
router.use('/Cuadrillas',cuadrillaRoutes);

module.exports = router;