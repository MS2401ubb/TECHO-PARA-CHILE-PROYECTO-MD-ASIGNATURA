import express from 'express';
const router = express.Router();

//import encargadoVoluntariosController from '../controllers/EncargadoVoluntarios.controller.js';

router.get('/ListaPostulantes',encargadoVoluntariosController.obtenerListaPostulantes);
router.get('/ListaVoluntarios',encargadoVoluntariosController.obtenerListaVoluntarios);
router.get('/ListaPostulantes/:id',encargadoVoluntariosController.obtenerPostulante);
router.get('/ListaVoluntarios/:id',encargadoVoluntariosController.obtenerVoluntario);

router.post('/ListaPostulantes/:id/aprobar',encargadoVoluntariosController.aprobarPostulante);
router.post('/ListaVoluntarios/asignarCuadrilla',encargadoVoluntariosController.asignarCuadrilla);
