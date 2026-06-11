const express = require('express')
const router = express.Router();
const encargadoCentralRoutes = require('./encargadoCentral.routes');
const encargadoVoluntariosRoutes = require('./EncargadoVoluntarios.routes');
const jornadaRoutes = require('./jornada.routes');

router.use('/Login', (req, res) => { res.json({ mensaje: 'LOGIN'}) }); 
router.use('/EncargadoCentral', encargadoCentralRoutes);
router.use('/AdministracionVoluntarios', encargadoVoluntariosRoutes);
router.use('/AdministracionJornada', jornadaRoutes);

module.exports = router;
