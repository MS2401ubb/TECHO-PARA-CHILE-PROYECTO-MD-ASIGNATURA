import express from 'express';
const router = express.Router();


import { generarTransporte } from '../controllers/encargadoCentral.controller.js';

router.post('/transporte/:codigoCiudad', generarTransporte);


export default router;