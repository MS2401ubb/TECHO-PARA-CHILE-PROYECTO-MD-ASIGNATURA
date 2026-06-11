const transporteAlimentoService = require('../services/transporte_alimentacion.service');
const { crearPdfManifiestoCarga } = require('../utils/transporte_alimento.report');
//const { crearPdfProvisionAlimento} = require('../utils/provision_alimento.report');

const generarTransporte = async (req, res) => {
    try {
        const { codigoCiudad } = req.params;
        const { trasladoPuntoOrigen } = req.body;

        if (!trasladoPuntoOrigen) {
            return res.status(400).json({ error: 'Falta campo obligatorio: Punto de origen o capacidad del bus.' });
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

const generarDocumentoProvisionAlimentos = async (req, res) => {
    try{
        const { codigoVivienda } = req.params;
        const { rutEncargado } = req.body;
        if(!rutEncargado){
            return res.status(400).json({ error: 'Falta campo obligatorio: RUT del encargado que gestiona el pedido '})
        }

        const provisionAlimentos = await transporteAlimentoService.generarDocumentoProvisionAlimentos(
            codigoVivienda,
            rutEncargado
        );
        return res.status(200).json(provisionAlimentos);
        //crearPdfProvisionAlimento(provisionAlimentos,res);
    } catch (error){
        console.error('Error al generar documento de alimentos:',error.message);
        return res.status(500).json({error: error.message});
    }
};

//no se si hacer un pdf con los datos o entregar un json

module.exports = {
    generarTransporte,
    generarDocumentoProvisionAlimentos
};