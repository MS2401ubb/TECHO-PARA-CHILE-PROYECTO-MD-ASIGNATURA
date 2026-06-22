import { Router } from "express";

//IMPORTACIONES NO NECESARIAS Y QUE HACEN REBUNDANCIA, SE VA A HACER MÁS ORDENADO
//import usuarioRoutes from './usuario.routes.js';
//import cuadrillaRoutes from './cuadrilla.routes.js';
//import jornadaRoutes from './jornada.routes.js';

import authRoutes from "./auth.routes.js";
import perfilRoutes from "./perfil.routes.js";
import voluntarioRoutes from './voluntario.routes.js';
//import jefeCuadrillaRoutes from "./jefeCuadrilla.routes.js";
import encargadoVoluntariosRoutes from './encargadoVoluntarios.routes.js';
import encargadoCentralRoutes from './encargadoCentral.routes.js';
import { verifyRoles } from "../middleware/authorization.middleware.js";

// RUTAS NO NECESARIAS Y QUE HACEN REBUNDANCIA, SE VA A HACER MÁS ORDENADO
// router.use('/Login', (req, res) => { res.json({ mensaje: 'LOGIN'}) }); 
// router.use('/EncargadoCentral', encargadoCentralRoutes);
// router.use('/AdministracionVoluntarios', encargadoVoluntariosRoutes);
// router.use('/AdministracionJornada', jornadaRoutes);
// router.use('/Usuario',usuarioRoutes);
// router.use('/Cuadrillas',cuadrillaRoutes);
// app.use('/api',jornadaRoutes);//????


export function routerApi(app) {
    const router = Router();
    app.use('/api', router);

    router.use('/auth', authRoutes);
    router.use('/perfil', verifyRoles(["Voluntario", "Jefe de Cuadrilla", "Encargado de Voluntarios", "Encargado de Central"]), perfilRoutes);
    //router.use('/voluntario', verifyRoles(["Voluntario"]), voluntarioRoutes);
    //router.use('/jefe-cuadrilla', verifyRoles(["Jefe de Cuadrilla"]), jefeCuadrillaRoutes);
    //router.use('/encargado-voluntarios', verifyRoles(["Encargado de Voluntarios"]), encargadoVoluntariosRoutes);
    router.use('/central', encargadoCentralRoutes);
}
