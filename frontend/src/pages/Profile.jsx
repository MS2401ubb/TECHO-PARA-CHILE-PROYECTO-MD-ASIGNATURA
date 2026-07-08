import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { editarUsuario } from '../services/user.service'

function Profile() {
	const { user, updateUser } = useAuth()
	const [message, setMessage] = useState('')
	const [errors, setErrors] = useState({})

	const validateForm = (payload) => {
		const nextErrors = {}

		if (!payload.nombre) nextErrors.nombre = 'El nombre no puede estar vacío.'
		if (!payload.primerApellido) nextErrors.primerApellido = 'El primer apellido no puede estar vacío.'
		if (!payload.segundoApellido) nextErrors.segundoApellido = 'El segundo apellido no puede estar vacío.'
		if (!payload.email) {
			nextErrors.email = 'El correo no puede estar vacío.'
		} else if (!/^\S+@\S+\.\S+$/.test(payload.email)) {
			nextErrors.email = 'El correo no tiene un formato válido.'
		}

		if (!payload.telefono) {
			nextErrors.telefono = 'El teléfono no puede estar vacío.'
		} else if (!/^\d{9}$/.test(payload.telefono)) {
			nextErrors.telefono = 'El teléfono debe tener exactamente 9 dígitos.'
		}

		return nextErrors
	}

	const onFieldChange = (event) => {
		const { name } = event.target
		setErrors((current) => {
			if (!current[name]) return current
			const next = { ...current }
			delete next[name]
			return next
		})
	}

	const onSubmit = async (event) => {
		event.preventDefault()
		setMessage('')
		setErrors({})
		const formData = new FormData(event.currentTarget)
		const payload = {
			nombre: String(formData.get('nombre') || '').trim(),
			primerApellido: String(formData.get('primerApellido') || '').trim(),
			segundoApellido: String(formData.get('segundoApellido') || '').trim(),
			email: String(formData.get('email') || '').trim(),
			telefono: String(formData.get('telefono') || '').trim(),
		}

		const formErrors = validateForm(payload)
		if (Object.keys(formErrors).length > 0) {
			setErrors(formErrors)
			setMessage('Revisa los campos marcados antes de guardar.')
			return
		}

		const result = await editarUsuario(user.rut, payload)

		if (!result.success) {
			setMessage(result.message || 'No fue posible actualizar tu perfil.')
			return
		}

		updateUser(payload)

		setMessage('Perfil actualizado.')
	}

	return (
		<section className="page-card">
			<h1>Mi perfil</h1>
			<p className="subtitle">Revisa y edita tu información básica.</p>

			<div className="profile-grid">
				<div><strong>RUT:</strong> {user?.rut}</div>
				<div><strong>Rol:</strong> {user?.rol}</div>
			</div>

			<form onSubmit={onSubmit} key={user?.rut || 'perfil-form'}>
				<div className="form-row split-2">
					<div>
						<label>Nombre</label>
						<input name="nombre" defaultValue={user?.nombre || ''} onChange={onFieldChange} />
						{errors.nombre && <p className="input-error">{errors.nombre}</p>}
					</div>
					<div>
						<label>Primer Apellido</label>
						<input name="primerApellido" defaultValue={user?.primerApellido || ''} onChange={onFieldChange} />
						{errors.primerApellido && <p className="input-error">{errors.primerApellido}</p>}
					</div>
					<div>
						<label>Segundo Apellido</label>
						<input name="segundoApellido" defaultValue={user?.segundoApellido || ''} onChange={onFieldChange} />
						{errors.segundoApellido && <p className="input-error">{errors.segundoApellido}</p>}
					</div>
				</div>
				<div className="form-row split-2">
					<div>
						<label>Correo</label>
						<input name="email" type="email" defaultValue={user?.email || ''} onChange={onFieldChange} />
						{errors.email && <p className="input-error">{errors.email}</p>}
					</div>
					<div>
						<label>Teléfono</label>
						<input name="telefono" defaultValue={user?.telefono || ''} onChange={onFieldChange} />
						{errors.telefono && <p className="input-error">{errors.telefono}</p>}
					</div>
				</div>
				<div className="form-actions">
					<button type="submit" className="btn-primary">Guardar</button>
				</div>
			</form>
			{message && <p className="helper-text">{message}</p>}
		</section>
	)
}

export default Profile
