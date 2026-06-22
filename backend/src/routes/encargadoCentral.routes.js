import { Router } from "express";

import { generarDocumentoTransporte, generarDocumentoProvisionAlimentos } from '../controllers/encargadoCentral.controller.js';

const router = Router();


router.post('/documento-transporte', generarDocumentoTransporte);
router.post('/documento-provision-alimentos', generarDocumentoProvisionAlimentos);


export default router;