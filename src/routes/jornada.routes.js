const express = require('express');

const router = express.Router();

//importamos middleware de validations
const { validarFinalizarJornada } = require('../validations/jornada.validation');

//importamos el controlador
const {finalizarJornadaController} = require('../controllers/jornada.controller');
//definicion de la ruta (url donde llama la web)
router.post('/jornadas/:id/finalizar',validarFinalizarJornada, finalizarJornadaController);

module.exports = router;