//const express = require('express');
import express from 'express';

const router = express.Router();

//importamos middleware de validations
//const { validarFinalizarJornada } = require('../validations/jornada.validation');
import { validarFinalizarJornada } from '../validations/jornada.validation.js';

//importamos el controlador
//const {finalizarJornadaController} = require('../controllers/jornada.controller');
import {finalizarJornadaController} from '../controllers/jornada.controller.js';

//definicion de la ruta (url donde llama la web)
router.post('/jornadas/:id/finalizar',validarFinalizarJornada, finalizarJornadaController);

export default router;