import express from 'express';
const router = express.Router();

//import cuadrillaController from '../controllers/Cuadrilla.controller.js';

router.get('/:id/:fecha-inicio',cuadrillaController.mostrarInfoCuadrilla);