const express = require('express');
const router = express.Router();


const encargadoCentralController = require('../controllers/encargadoCentral.controller');

router.post('/planificacion-central/:codigoCiudad/transporte', encargadoCentralController.generarTransporte);
router.post('/alimentos/:codigoVivienda',encargadoCentralController.generarDocumentoProvisionAlimentos);




export default router;