import { registerVoluntario } from './auth.service'

export async function enviarPostulacionVoluntario(formData) {
	return registerVoluntario(formData)
}
