import express from 'express';
const router = express.Router();

//import encargadoVoluntariosController from '../controllers/EncargadoVoluntarios.controller.js';
import encargadoVoluntariosController from '../controllers/EncargadoVoluntarios.controller.js';

router.get('/ListaPostulantes',encargadoVoluntariosController.obtenerListaPostulantes);
router.get('/ListaVoluntarios',encargadoVoluntariosController.obtenerListaVoluntarios);
// En EncargadoVoluntarios.routes.js -> Uso macro / exclusivo
// Genera propuesta regional preliminar para validación de la Central.
router.get('/ListaVoluntarios/:idRegion/Cercania',encargadoVoluntariosController.obtenerVoluntariosPorZonaRiesgo); //ordenados por PRIORIDAD. Se decide por cercanía a zona de riesgo.
//DEBE PERMITIR COPIAR/DESCARGAR LOS QUE SELECCIONE, PARA QUE LUEGO EN /CUADRILLA PUEDA ASIGNARLOS TODOS DE UNA AL CREAR UNA CUADRILLA, O PARA FACILITAR SEPARACIÓN DE VOLUNTARIOS EN CADA CUADRILLA.
router.get('/ListaPostulantes/:rut', encargadoVoluntariosController.obtenerPostulante);
router.get('/ListaVoluntarios/:rut', encargadoVoluntariosController.obtenerVoluntario);

router.patch('/ListaPostulantes/:rut/aprobar', encargadoVoluntariosController.aprobarIngresoPostulante);

router.post('/ListaVoluntarios/asignar-cuadrilla',encargadoVoluntariosController.asignarCuadrilla);

export default router;