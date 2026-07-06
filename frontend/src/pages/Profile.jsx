import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { editarUsuario } from '../services/user.service'

function Profile() {
	const { user, token } = useAuth()
	const canEdit = user?.rol === 'Encargado de Central' || user?.rol === 'admin'
	const [telefono, setTelefono] = useState(user?.telefono || '')
	const [email, setEmail] = useState(user?.email || '')
	const [message, setMessage] = useState('')

	const onSubmit = async (event) => {
		event.preventDefault()
		setMessage('')

		const result = await editarUsuario(token, user.rut, {
			email,
			telefono,
		})

		setMessage(result.success ? 'Perfil actualizado.' : result.message)
	}

	return (
		<section className="page-card">
			<h1>Mi perfil</h1>
			<p className="subtitle">Revisa y edita tu información básica.</p>

			<div className="profile-grid">
				<div><strong>RUT:</strong> {user?.rut}</div>
				<div><strong>Nombre:</strong> {user?.nombre} {user?.primerApellido} {user?.segundoApellido}</div>
				<div><strong>Rol:</strong> {user?.rol}</div>
			</div>

			<form onSubmit={onSubmit}>
				<div className="form-row split-2">
					<div>
						<label>Correo</label>
						<input value={email} onChange={(e) => setEmail(e.target.value)} disabled={!canEdit} />
					</div>
					<div>
						<label>Teléfono</label>
						<input value={telefono} onChange={(e) => setTelefono(e.target.value)} disabled={!canEdit} />
					</div>
				</div>

				{canEdit && (
					<div className="form-actions">
						<button type="submit" className="btn-primary">Guardar</button>
					</div>
				)}
			</form>

			{!canEdit && <p className="helper-text">Edición de perfil restringida para tu rol en esta versión.</p>}
			{message && <p className="helper-text">{message}</p>}
		</section>
	)
}

export default Profile
