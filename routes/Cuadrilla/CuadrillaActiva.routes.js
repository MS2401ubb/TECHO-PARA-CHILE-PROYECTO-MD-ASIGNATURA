import express from 'express';
const router = express.Router();

//import cuadrillaController from '../controllers/Cuadrilla.controller.js';

router.get('/',cuadrillaController.listarCuadrillas); //en funciones cuadrilla revisar url para en un if al inicio de la función, cual lista de cuadrilas necesita
router.get('/lista-regiones',cuadrillaController.listarPersonalAsignado);
router.get('/filtrar',cuadrillaController.busquedaConFiltroCuadrillas);
router.get('/lista-trabajadores');
router.post('/activar-cuadrilla');
router.post('/asignar-voluntario');//esta deberia estar detra de '/:id/:fecha_inicio'
router.get('/region'); //de la cuadrilla específica, necesita id y fecha_inicio;
router.get('/zona-afectada'); //lo mismo que region, pero para área con cuadrillas de catastrofe relacionada


