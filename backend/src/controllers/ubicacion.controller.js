import { getCiudadesByRegionService, getRegionesService } from '../services/ubicacion.service.js'
import { handleErrorClient, handleErrorServer, handleSuccess } from '../handlers/responseHandlers.js'

export async function getRegiones(req, res) {
  try {
    const regiones = await getRegionesService()
    return handleSuccess(res, 200, 'Regiones obtenidas exitosamente', regiones)
  } catch (error) {
    return handleErrorServer(res, 500, 'Error al obtener regiones', error.message)
  }
}

export async function getCiudadesByRegion(req, res) {
  try {
    const { codigoRegion } = req.params
    const ciudades = await getCiudadesByRegionService(codigoRegion)
    return handleSuccess(res, 200, 'Ciudades obtenidas exitosamente', ciudades)
  } catch (error) {
    if (error.message.includes('codigoRegion')) {
      return handleErrorClient(res, 400, error.message)
    }
    return handleErrorServer(res, 500, 'Error al obtener ciudades por región', error.message)
  }
}
