//const express = require('express');
import express from 'express';
const router = express.Router();


//const encargadoCentralController = require('../controllers/encargadoCentral.controller');
import encargadoCentralController from '../controllers/encargadoCentral.controller.js';

router.post('/transporte/:codigoCiudad', encargadoCentralController.generarTransporte);
router.post('/alimentos/:codigoVivienda',encargadoCentralController.generarDocumentoProvisionAlimentos);




export default router;