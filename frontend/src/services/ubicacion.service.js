import axios from './root.service.js'

export async function obtenerRegiones() {
  try {
    const response = await axios.get('/ubicacion/regiones')
    return { success: true, data: response.data.data || [] }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Error al conectar con el servidor',
      data: [],
    }
  }
}

export async function obtenerCiudadesPorRegion(codigoRegion) {
  try {
    const response = await axios.get(`/ubicacion/regiones/${codigoRegion}/ciudades`)
    return { success: true, data: response.data.data || [] }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Error al conectar con el servidor',
      data: [],
    }
  }
}
