const express = require('express');
const encargadoVoluntariosController = require('../controllers/EncargadoVoluntarios.controller');

const router = express.Router();

router.get('/ListaPostulantes', encargadoVoluntariosController.obtenerListaPostulantes);
router.get('/ListaVoluntarios', encargadoVoluntariosController.obtenerListaVoluntarios);
router.get('/ListaPostulantes/:rut', encargadoVoluntariosController.obtenerPostulante);
router.get('/ListaVoluntarios/:rut', encargadoVoluntariosController.obtenerVoluntario);
router.patch('/ListaPostulantes/:rut/aprobar', encargadoVoluntariosController.aprobarIngresoPostulante);

module.exports = router;