import transporteAlimentoService from '../services/transporte_alimentacion.service.js';
import { crearPdfManifiestoCarga } from '../utils/documentoTransporte.util.js';
import { crearPdfProvisionAlimentacion } from '../utils/documentoAlimentacion.util.js';

export const generarDocumentoTransporte = async (req, res) => {
    try {
        const { codigoCiudad } = req.params;
        const { trasladoPuntoOrigen } = req.body;

        if (!trasladoPuntoOrigen) {
            return res.status(400).json({ error: 'Falta campo obligatorio: Punto de origen.' });
        }
    
        const datosLogística = await transporteAlimentoService.generarDocumentoTransporte(
            codigoCiudad, 
            trasladoPuntoOrigen
        );

        crearPdfManifiestoCarga(datosLogística, res);

    } catch (error) {
        console.error('Error al generar manifiesto:', error.message);
        // Si falló una validación (ej: voluntario sin contacto), capturamos el mensaje y avisamos al frontend
        return res.status(500).json({ error: error.message });
    }
};

export const generarDocumentoProvisionAlimentos = async (req, res) => {
    try{
        const { codigoVivienda } = req.params;
        const { rutEncargado } = req.body;
        if(!rutEncargado){
            return res.status(400).json({ error: 'Falta campo obligatorio: RUT del encargado que gestiona el pedido '})
        }

        const provisionAlimentos = await transporteAlimentoService.generarProvisionAlimentos(
            codigoVivienda,
            rutEncargado
        );

        //crearPdfProvisionAlimentacion(provisionAlimentos,res);
    } catch (error){
        console.error('Error al generar documento:',error,message);
        return res.status(500).json({error: error.message});
    }
};