import axios from './root.service.js'

export async function crearReporte(data, token = null) {
	try {
		const headers = token ? { Authorization: `Bearer ${token}` } : {}
		const response = await axios.post('/reporte', data, { headers })
		return { success: true, data: response.data.data, message: response.data.message }
	} catch (error) {
		const details = error.response?.data?.errorDetails
		const detailMessage = Array.isArray(details) ? details.join(' ') : ''
		const message = [error.response?.data?.message, detailMessage].filter(Boolean).join(': ')
		return { success: false, message: message || 'Error al conectar con el servidor' }
	}
}

export async function listarReportes() {
	try {
		const response = await axios.get('/reporte')
		return { success: true, data: response.data.data || [] }
	} catch (error) {
		return { success: false, message: error.response?.data?.message || 'Error al conectar con el servidor', data: [] }
	}
}

export async function actualizarEstadoReporte(id, estado) {
	try {
		const response = await axios.patch(`/reporte/${id}/estado`, { estado })
		return { success: true, data: response.data.data }
	} catch (error) {
		const details = error.response?.data?.errorDetails
		const detailMessage = Array.isArray(details) ? details.join(' ') : ''
		const message = [error.response?.data?.message, detailMessage].filter(Boolean).join(': ')
		return { success: false, message: message || 'Error al conectar con el servidor' }
	}
}
