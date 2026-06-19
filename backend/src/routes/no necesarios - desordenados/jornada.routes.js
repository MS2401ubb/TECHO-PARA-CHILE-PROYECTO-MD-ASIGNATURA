import express from 'express';

const router = express.Router();

//importamos middleware de validations
import { validarFinalizarJornada } from '../../validations/jornada.validation.js';

//importamos el controlador
import { finalizarJornadaController } from '../../controllers/no necesarios - desordenados/jornada.controller.js';
//definicion de la ruta (url donde llama la web)
router.post('/jornadas/:id/finalizar',validarFinalizarJornada, finalizarJornadaController);

export default router;