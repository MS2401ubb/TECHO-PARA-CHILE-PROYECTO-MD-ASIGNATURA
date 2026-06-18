import express from 'express';
const router = express.Router();

//import cuadrillaController from '../controllers/Cuadrilla.controller.js';

router.get('/',cuadrillaController.listarCuadrillas); //en funciones cuadrilla revisar url para en un if al inicio de la función, cual lista de cuadrilas necesita
router.get('/lista-regiones',cuadrillaController.listarRegionesConZonaRiesgo);
router.get('/filtrar',cuadrillaController.busquedaConFiltroCuadrillas);
//personal = {Jefe de cuadrilla, Voluntarios}.
// En Cuadrillas.routes.js -> Uso micro / compartido (Central y Jefes)
// Busca personal libre para asignación directa en obras o apoyo por retrasos.
router.get('/personal-asignado',cuadrillaController.obtenerPersonalAsignado); //personal ya asignado.
router.get('/personal-disponible',cuadrillaController.obtenerPersonalDisponible);    
router.post('/crear-cuadrilla',cuadrillaController.crearCuadrilla);


router.post('/:id/:fecha_inicio/asignar-jefe');//esta deberia estar detra de '/:id/:fecha_inicio'
//CAMBIAR 'asignar-voluntario', DEBERIA SER RUTA DE 'EncargadoVoluntarios.routes.js' YA QUE ES MÁS UTIL PARA EL CLIENTE QUE SEA SELECCIÓN DIRECTA DESDE LA LISTA MASIVA.
/*router.get('/:id/fecha_inicio/detalles-region'); //de la cuadrilla específica, necesita id y fecha_inicio;
router.get('/id:/fecha_inicio/detalles-zona'); //lo mismo que region, pero para área con cuadrillas de catastrofe relacionada
*/
//las dos rutas de arriba se unificaron como 'territorio' pero no me queda claro que tan util es. revisar?
router.get('/:id/:fecha_inicio/ubicacion',cuadrillaController.obtenerDetallesUbicacion); //requiere JOIN de las 3 entities = {CuadrillaTrabajaEnVivienda, Vivienda, Ciudad, Region} relacionadas con Vivienda para desplegar toda la info relacionada.

router.get('/:id/:fecha_inicio',cuadrillaController.obtenerInformacionCuadrilla);

export default router;