import axios from './root.service.js'

export async function obtenerPostulantes() {
  try {
    const response = await axios.get('/voluntario/postulantes')
    return { success: true, data: response.data.data || [] }
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Error al conectar con el servidor', data: [] }
  }
}

export async function obtenerDetallesVoluntario(rut) {
  try {
    const response = await axios.get(`/voluntario/${rut}/detalles`)
    return { success: true, data: response.data.data }
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Error al conectar con el servidor' }
  }
}

export async function aprobarPostulante(rut, body) {
  try {
    const response = await axios.post(`/voluntario/${rut}/aprobar`, body)
    return { success: true, data: response.data.data, message: response.data.message }
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Error al conectar con el servidor' }
  }
}

export async function rechazarPostulante(rut, motivo) {
  try {
    const response = await axios.post(`/voluntario/${rut}/rechazar`, { motivo })
    return { success: true, data: response.data.data, message: response.data.message }
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Error al conectar con el servidor' }
  }
}

export async function obtenerVoluntariosActivos() {
  try {
    const response = await axios.get('/voluntario/voluntarios')
    return { success: true, data: response.data.data || [] }
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Error al conectar con el servidor', data: [] }
  }
}

export async function obtenerDisponiblesPorZona(codigoCiudad) {
  try {
    const response = await axios.get(`/voluntario/disponibles-zona/${codigoCiudad}`)
    return { success: true, data: response.data.data || [] }
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Error al conectar con el servidor', data: [] }
  }
}
