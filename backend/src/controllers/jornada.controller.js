import jornadaService from '../services/jornada.service.js';

export const finalizarJornadaController = async (req, res) => {
  try {
    const idJornada = parseInt(req.params.id);
    const { materiales } = req.body;
    // REVISAR PARA HACER UN .VALIDATE

    if (Number.isNaN(idJornada)) {
      return res.status(400).json({ error: 'El id de jornada debe ser numérico.' });
    }

    // Llamamos al servicio para ejecutar toda la lógica de negocio
    const resultado = await jornadaService.finalizarJornadaService(idJornada, materiales);

    return res.status(200).json(resultado);
  } catch (error) {
    // Si el servicio lanza un Error (throw new Error), cae aquí directamente
    return res.status(400).json({ error: error.message });
  }
};