import express from 'express';
const router = express.Router();

import activa from '../Cuadrilla/CuadrillaActiva.routes.js';
import filtrar from '../Cuadrilla/Filtrar.routes.js';
 
//import cuadrillaController from '../controllers/Cuadrilla.controller.js';

router.get('/',cuadrillaController.listarCuadrillas);
router.get('/:id/:fecha-inicio',cuadrillaController.mostrarInfoCuadrilla); //cambiar ':fecha-inicio' a query? revisar si es necesario o mejor

