const express = require('express')
const router = express.Router();

import usuarioRoutes from './Usuario.routes.js';
import encargadoVoluntariosRoutes from './EncargadoVoluntarios.routes.js';
const encargadoCentralRoutes = require('./encargadoCentral.routes');
import cuadrillaRoutes from './Cuadrilla/Cuadrilla.routes.js';
import voluntarioRoutes from './Voluntario.routes.js';

router.use('/', encargadoCentralRoutes); //?
router.use('/Usuario',usuarioRoutes);
router.use('/AdministracionVoluntarios',encargadoVoluntariosRoutes);
router.use('/Cuadrillas',cuadrillaRoutes);

module.exports = router;