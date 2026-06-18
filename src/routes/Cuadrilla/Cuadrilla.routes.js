import express from 'express';
const router = express.Router();

//import activa from '.CuadrillaActiva.routes.js';
import activa from './CuadrillaActiva.routes.js';
 
import cuadrillaController from '../../controllers/Cuadrilla.controller.js'

router.get('/',cuadrillaController.listarCuadrillas);
router.get('/filtrar',cuadrillaController.busquedaConFiltroCuadrillas);

router.use('/activas',activa);

router.get('/:id/:fecha_inicio',cuadrillaController.mostrarInfoCuadrilla); //cambiar ':fecha-inicio' a query? revisar si es necesario o mejor

export default router;