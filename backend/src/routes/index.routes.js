import { Router } from "express";
import { verifyRoles } from "../middleware/authorization.middleware.js";

import authRoutes from "./auth.routes.js";
import cuadrillaRoutes from './cuadrilla.routes.js';
import documentoLogisticoRoutes from './documentoLogistico.routes.js';
import reporteRoutes from './reporte.routes.js';
import herramientasRoutes from './herramientas.routes.js';
import usuarioRoutes from './usuario.routes.js';
import viviendaRoutes from './vivienda.routes.js';
import voluntarioRoutes from './voluntario.routes.js';

export function routerApi(app) {
    const router = Router();
    app.use('/api', router);

    router.use('/auth', authRoutes);
    // PARA PROBAR http://localhost:3000/api/auth/login :
    //{
    // "rut": "11111111-1",
    // "password": "juan123vol"
    //}
    router.use('/cuadrilla', cuadrillaRoutes);
    router.use('/documento-logistico', documentoLogisticoRoutes);
    // PARA PROBAR http://localhost:3000/api/documento-logistico/documento-provision-alimentos :
    //{
    // "codigoVivienda": "CONC-001",
    // "rutEncargado": "24242424-4"
    //}
    router.use('/reporte', reporteRoutes);
    router.use('/herramientas', herramientasRoutes);
    router.use('/usuario', usuarioRoutes);
    router.use('/vivienda', viviendaRoutes);
    router.use('/voluntario', voluntarioRoutes);
}
