import axios from './root.service.js'
import cookies from 'js-cookie'

export async function login(rut, password) {
	try {
		const response = await axios.post('/auth/login', {
			rut,
			password,
		})

		const { token, user } = response.data.data || {}

		if (!token || !user) {
			return { success: false, message: 'Respuesta inválida del servidor' }
		}

		cookies.set('jwt-auth', token, { path: '/' })
		sessionStorage.setItem('usuario', JSON.stringify(user))

		return { success: true, token, user }
	} catch (error) {
		return {
			success: false,
			message: error.response?.data?.message || 'Error al conectar con el servidor',
		}
	}
}

export async function logout() {
	try {
		await axios.post('/auth/logout')
	} catch {
		// El front igualmente limpia sesión local.
	} finally {
		sessionStorage.removeItem('usuario')
		cookies.remove('jwt-auth')
	}
}

export async function registerVoluntario(data) {
	try {
		const response = await axios.post('/auth/register', { ...data, rol: 'Voluntario' })

		return {
			success: true,
			data: response.data.data,
			message: response.data.message || 'Postulación enviada',
		}
	} catch (error) {
		return {
			success: false,
			message: error.response?.data?.message || 'Error al conectar con el servidor',
		}
	}
}
