const express = require('express')
const router = express.Router();
const encargadoCentralRoutes = require('./encargadoCentral.routes');
const encargadoVoluntariosRoutes = require('./EncargadoVoluntarios.routes');

router.use('/', encargadoCentralRoutes);
router.use('/AdministracionVoluntarios', encargadoVoluntariosRoutes);

module.exports = router;