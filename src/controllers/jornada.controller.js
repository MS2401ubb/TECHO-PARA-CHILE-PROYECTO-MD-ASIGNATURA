const { finalizarJornadaService } = require('../services/jornada.service');

const finalizarJornadaController = async (req, res) => {
  try {
    const idJornada = parseInt(req.params.id);
    const { materiales } = req.body;

    // Llamamos al servicio para ejecutar toda la lógica de negocio
    const resultado = await finalizarJornadaService(idJornada, materiales);

    return res.status(200).json(resultado);
  } catch (error) {
    // Si el servicio lanza un Error (throw new Error), cae aquí directamente
    return res.status(400).json({ error: error.message });
  }
};

module.exports = { finalizarJornadaController };