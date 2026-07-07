//const express = require('express');
import express from 'express';
const router = express.Router();

import usuarioRoutes from './Usuario.routes.js';
//const encargadoVoluntariosRoutes = require('./EncargadoVoluntarios.routes.js');
//const encargadoCentralRoutes = require('./encargadoCentral.routes.js');
import encargadoVoluntariosRoutes from './EncargadoVoluntarios.routes.js';
import encargadoCentralRoutes from './encargadoCentral.routes.js';
import cuadrillaRoutes from './Cuadrilla/Cuadrilla.routes.js';
import voluntarioRoutes from './Voluntario.routes.js';
import jornadaRoutes from './jornada.routes.js';

router.use('/Login', (req, res) => { res.json({ mensaje: 'LOGIN'}) }); 
router.use('/EncargadoCentral', encargadoCentralRoutes);
router.use('/AdministracionVoluntarios', encargadoVoluntariosRoutes);
router.use('/Usuario',usuarioRoutes);
router.use('/Cuadrillas',cuadrillaRoutes);
router.use('/AdministracionJornada', jornadaRoutes);

export default router;
