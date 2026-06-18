import express from 'express';
const router = express.Router();
//CUANDO SE COMPLETE CONTROLLER
import usuarioController from '../controllers/Usuario.controller.js';

router.get('/',usuarioController.mostrarUsuario); //lo manda a '/Acceso' si no tiene sesion iniciada? 
router.patch('/Modificar-perfil',usuarioController.actualizarUsuario);
router.post('/Acceso',usuarioController.iniciarSesion);

export default router;