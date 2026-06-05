import express from 'express';
const router = express.Router();
//CUANDO SE COMPLETE CONTROLLER
//import usuarioController from '../controllers/Usuario.controller.js';

router.get('/',usuarioController.mostrarUsuario);
router.get('/modificar',usuarioController.mostrarUsuario);
router.patch('/modificar',usuarioController.actualizarUsuario);

