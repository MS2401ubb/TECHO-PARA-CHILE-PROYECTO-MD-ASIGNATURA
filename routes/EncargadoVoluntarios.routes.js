import express from 'express';
import encargadoVoluntariosController from '../controllers/EncargadoVoluntarios.controller.js';

const router = express.Router();

router.get('/ListaPostulantes', encargadoVoluntariosController.obtenerListaPostulantes);
router.get('/ListaVoluntarios', encargadoVoluntariosController.obtenerListaVoluntarios);
router.get('/ListaPostulantes/:rut', encargadoVoluntariosController.obtenerPostulante);
router.get('/ListaVoluntarios/:rut', encargadoVoluntariosController.obtenerVoluntario);
router.patch('/ListaPostulantes/:rut/aprobar', encargadoVoluntariosController.aprobarIngresoPostulante);

export default router;

