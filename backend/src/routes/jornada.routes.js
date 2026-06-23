import express from 'express';
import { finalizarJornadaController } from '../controllers/jornada.controller.js';


const router = express.Router();

//definicion de la ruta (url donde llama la web)
router.post('/:id/finalizar', finalizarJornadaController);

export default router;