import transporteAlimentoService from '../services/documentoLogistico.service.js';
import { handleSuccess, handleErrorClient, handleErrorServer} from '../handlers/responseHandlers.js';
import { validarDatosDeCentralTransporte, validarDatosProvisionAlimentos } from '../validations/documentoLogistico.validation.js';
import { crearPdfManifiestoCarga } from '../utils/documentoTransporte.util.js';
import { crearPdfProvisionAlimentacion } from '../utils/documentoAlimentacion.util.js';

export const generarDocumentoTransporte = async (req, res) => {
    try {
        const { body } = req;
        const { error, value } = validarDatosDeCentralTransporte.validate(body);
        
        if (error) {
            console.log('Error de validación al generar documento de transporte:', error);
            return handleErrorClient(res, 400, "Datos de transporte inválidos", error.message);
        }
    
        const datosLogística = await transporteAlimentoService.generarDocumentoTransporte(body);
        await crearPdfManifiestoCarga(datosLogística, res);

    } catch (error) {
        return handleErrorServer(res, 500, "Error del servidor al generar documento de transporte", error.message);
    }
};
export const generarDocumentoProvisionAlimentos = async (req, res) => {
    try{
        const { body } = req;
        const { error, value } = validarDatosProvisionAlimentos.validate(body);

        if (error) {
            console.log('Error de validación al generar documento de provisión de alimentos:', error);
            return handleErrorClient(res, 400, "Datos de provisión de alimentos inválidos", error.message);
        }
    
        const provisionAlimentos = await transporteAlimentoService.generarDocumentoProvisionAlimentos(body);
        await crearPdfProvisionAlimentacion(provisionAlimentos,res);

    } catch (error){
        return handleErrorServer(res, 500, "Error del servidor al generar documento de provisión de alimentos", error.message);
    }
};