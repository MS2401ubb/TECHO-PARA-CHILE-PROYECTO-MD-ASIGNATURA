import axios from './root.service.js'

export async function obtenerViviendas() {
  try {
    const response = await axios.get('/vivienda')
    return { success: true, data: response.data.data || [] }
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Error al conectar con el servidor', data: [] }
  }
}

export async function editarVivienda(codigo, body) {
  try {
    const response = await axios.patch(`/vivienda/${codigo}`, body)
    return { success: true, data: response.data.data, message: response.data.message }
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Error al conectar con el servidor' }
  }
}

export async function obtenerViviendasPlanificables() {
  try {
    const response = await axios.get('/vivienda/planificables')
    return { success: true, data: response.data.data || [] }
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Error al conectar con el servidor', data: [] }
  }
}

export async function obtenerDashboardCentral() {
  try {
    const response = await axios.get('/vivienda/dashboard/central')
    return { success: true, data: response.data.data || null }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Error al conectar con el servidor',
      data: null,
    }
  }
}
