import axios from './root.service.js'

export async function crearReporte(data) {
	try {
		const response = await axios.post('/reporte', data)
		return { success: true, data: response.data.data, message: response.data.message }
	} catch (error) {
		return { success: false, message: error.response?.data?.message || 'Error al conectar con el servidor' }
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
		return { success: false, message: error.response?.data?.message || 'Error al conectar con el servidor' }
	}
}
