const express = require('express');
const router = express.Router();


const encargadoCentralController = require('../controllers/encargadoCentral.controller');

router.post('/transporte/:codigoCiudad', encargadoCentralController.generarTransporte);
router.post('/alimentos/:codigoVivienda',encargadoCentralController.generarDocumentoProvisionAlimentos);




export default router;