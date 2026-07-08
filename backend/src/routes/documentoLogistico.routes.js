import { Router } from "express";
import { generarDocumentoTransporte, generarDocumentoProvisionAlimentos, obtenerVistaProvisionAlimentos } from "../controllers/documentoLogistico.controller.js";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { verifyRoles } from "../middleware/authorization.middleware.js";

const router = Router();

    // PARA PROBAR http://localhost:3000/api/documento-logistico/documento-provision-alimentos :
    //{
    // "codigoVivienda": "CONC-001",
    // "rutEncargado": "24242424-4"
    //}
router.post(
	"/documento-transporte",
	authenticateJwt,
	verifyRoles(["Encargado de Central", "admin"]),
	generarDocumentoTransporte
);
    // PARA PROBAR http://localhost:3000/api/documento-logistico/documento-provision-alimentos :
    //{
    // "codigoVivienda": "CONC-001",
    // "rutEncargado": "24242424-4"
    //}
router.post(
	"/provision-alimentos/preview",
	authenticateJwt,
	verifyRoles(["Encargado de Central", "admin"]),
	obtenerVistaProvisionAlimentos
);

router.post(
	"/documento-provision-alimentos",
	authenticateJwt,
	verifyRoles(["Encargado de Central", "admin"]),
	generarDocumentoProvisionAlimentos
);

export default router;