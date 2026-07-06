import axios from './root.service.js'

export async function obtenerUsuarios() {
	try {
		const response = await axios.get('/usuario')
		return { success: true, data: response.data.data || [] }
	} catch (error) {
		return { success: false, message: error.response?.data?.message || 'Error al conectar con el servidor', data: [] }
	}
}

export async function editarUsuario(rut, body) {
	try {
		const response = await axios.patch(`/usuario/${rut}`, body)
		return { success: true, data: response.data.data }
	} catch (error) {
		return { success: false, message: error.response?.data?.message || 'Error al conectar con el servidor' }
	}
}

export async function asignarRolUsuario(rut, rol) {
	try {
		const response = await axios.patch(`/usuario/${rut}/asignar-rol`, { rol })
		return { success: true, data: response.data.data }
	} catch (error) {
		return { success: false, message: error.response?.data?.message || 'Error al conectar con el servidor' }
	}
}
