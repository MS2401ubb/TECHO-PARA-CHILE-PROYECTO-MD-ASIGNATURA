const transporteAlimentoService = require('../services/transporte_alimentacion.service');
const { crearPdfManifiestoCarga } = require('../utils/documentoTransporte.report');

const generarTransporte = async (req, res) => {
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

module.exports = {generarTransporte};