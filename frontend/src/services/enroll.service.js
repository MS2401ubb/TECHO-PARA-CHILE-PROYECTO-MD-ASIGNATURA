import { registerVoluntario } from './auth.service'
import { obtenerCiudadesPorRegion, obtenerRegiones } from './ubicacion.service'

export async function enviarPostulacionVoluntario(formData) {
	return registerVoluntario(formData)
}

export async function listarRegiones() {
	return obtenerRegiones()
}

export async function listarCiudadesPorRegion(codigoRegion) {
	return obtenerCiudadesPorRegion(codigoRegion)
}
