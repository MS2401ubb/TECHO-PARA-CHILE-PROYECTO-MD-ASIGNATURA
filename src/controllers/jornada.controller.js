const { finalizarJornadaService } = require('../services/jornada.service');

const finalizarJornadaController = async (req, res) => {
  try {
    const idJornada = parseInt(req.params.id);//extrae el numero de la url 
    const { materiales } = req.body;//lista materiales

    // Llamamos al servicio y se ejecuta todo lo de service
    const resultado = await finalizarJornadaService(idJornada, materiales);

    return res.status(200).json(resultado);
  } catch (error) {
    // Si el servicio lanza un error se viene para aca
    return res.status(400).json({ error: error.message });
  }
};

module.exports = { finalizarJornadaController };