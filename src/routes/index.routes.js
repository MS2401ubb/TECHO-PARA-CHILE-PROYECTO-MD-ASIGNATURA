const express = require('express')
const router = express.Router();

import usuarioRoutes from './Usuario.routes.js';
const encargadoVoluntariosRoutes = require('./EncargadoVoluntarios.routes');
<<<<<<< HEAD
const jornadaRoutes = require('./jornada.routes');
=======
const encargadoCentralRoutes = require('./encargadoCentral.routes');
import cuadrillaRoutes from './Cuadrilla/Cuadrilla.routes.js';
import voluntarioRoutes from './Voluntario.routes.js';
import jornadaRoutes from './jornada.routes.js';
>>>>>>> main

router.use('/Login', (req, res) => { res.json({ mensaje: 'LOGIN'}) }); 
router.use('/EncargadoCentral', encargadoCentralRoutes);
router.use('/AdministracionVoluntarios', encargadoVoluntariosRoutes);
<<<<<<< HEAD
router.use('/AdministracionJornada', jornadaRoutes);
=======
router.use('/Usuario',usuarioRoutes);
router.use('/Cuadrillas',cuadrillaRoutes);
app.use('/api',jornadaRoutes);//????

>>>>>>> main

module.exports = router;
