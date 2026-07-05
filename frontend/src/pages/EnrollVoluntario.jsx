import { useState } from 'react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.hostname}:3000` : 'http://localhost:3000')

const today = new Date().toISOString().split('T')[0]

function RegisterVolunteer() {
  const [formData, setFormData] = useState({
    rut: '',
    password: '',
    name: '',
    primerApellido: '',
    segundoApellido: '',
    fechaNacimiento: '',
    email: '',
    phone: '',
    city: '',
    experience: '',
  })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
    setErrors((current) => ({
      ...current,
      [name]: '',
    }))
    setSubmitted(false)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const nextErrors = {}
    if (!formData.rut.trim()) nextErrors.rut = 'RUT es obligatorio.'
    if (!formData.password || formData.password.length < 8) nextErrors.password = 'Contraseña (8+ caracteres) es obligatoria.'
    if (!formData.name.trim()) nextErrors.name = 'Nombre es obligatorio.'
    if (!formData.primerApellido.trim()) nextErrors.primerApellido = 'Primer apellido es obligatorio.'
    if (!formData.fechaNacimiento) nextErrors.fechaNacimiento = 'Fecha de nacimiento es obligatoria.'
    else if (new Date(formData.fechaNacimiento) > new Date(today)) nextErrors.fechaNacimiento = 'La fecha de nacimiento no puede ser futura.'
    if (!formData.email.trim()) nextErrors.email = 'Email es obligatorio.'
    if (!formData.phone.trim()) nextErrors.phone = 'Teléfono es obligatorio.'

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setSubmitted(true)

    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            rut: formData.rut,
            password: formData.password,
            nombre: formData.name,
            primerApellido: formData.primerApellido,
            segundoApellido: formData.segundoApellido,
            fechaNacimiento: formData.fechaNacimiento,
            email: formData.email,
            telefono: formData.phone,
            rol: 'Voluntario',
            telefonoEmergencia: formData.phone
          })
        })

        const payload = await res.json()
        if (!res.ok) {
          setSubmitted(false)
          setErrors({ form: payload?.message || 'Error al registrar' })
          return
        }

        setFormData({ rut: '', password: '', name: '', primerApellido: '', segundoApellido: '', fechaNacimiento: '', email: '', phone: '', city: '', experience: '' })
      } catch (err) {
        console.error(err)
        setErrors({ form: 'Error de conexión al servidor' })
        setSubmitted(false)
      }
    })()
  }

  return (
    <section className="volunteer-form-card">
      <div className="form-header">
        <p className="eyebrow">Voluntariado</p>
        <h2>Inscripción para Voluntario</h2>
        <p>Comparte sus datos para que el equipo pueda gestionarlo y asignarlo a una jornada.</p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-row">
          <label htmlFor="rut">RUT</label>
          <input id="rut" name="rut" type="text" value={formData.rut} onChange={handleChange} placeholder="12345678-9" />
          {errors.rut && <span className="input-error">{errors.rut}</span>}
        </div>

        <div className="form-row">
          <label htmlFor="password">Contraseña</label>
          <input id="password" name="password" type="password" value={formData.password} onChange={handleChange} placeholder="mín. 8 caracteres" />
          {errors.password && <span className="input-error">{errors.password}</span>}
        </div>

        <div className="form-row">
          <label htmlFor="name">Nombre</label>
          <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} placeholder="Ej. Juan" />
          {errors.name && <span className="input-error">{errors.name}</span>}
        </div>

        <div className="form-row">
          <label htmlFor="primerApellido">Primer apellido</label>
          <input id="primerApellido" name="primerApellido" type="text" value={formData.primerApellido} onChange={handleChange} placeholder="Ej. Pérez" />
          {errors.primerApellido && <span className="input-error">{errors.primerApellido}</span>}
        </div>

        <div className="form-row">
          <label htmlFor="segundoApellido">Segundo apellido (opcional)</label>
          <input id="segundoApellido" name="segundoApellido" type="text" value={formData.segundoApellido} onChange={handleChange} placeholder="Ej. Gómez" />
        </div>

        <div className="form-row">
          <label htmlFor="fechaNacimiento">Fecha de nacimiento</label>
          <input id="fechaNacimiento" name="fechaNacimiento" type="date" value={formData.fechaNacimiento} onChange={handleChange} max={today} />
          {errors.fechaNacimiento && <span className="input-error">{errors.fechaNacimiento}</span>}
        </div>

        <div className="form-row">
          <label htmlFor="email">Correo electrónico</label>
          <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="ejemplo@mail.com" />
          {errors.email && <span className="input-error">{errors.email}</span>}
        </div>

        <div className="form-row">
          <label htmlFor="phone">Teléfono</label>
          <input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="+56 9 1234 5678" />
          {errors.phone && <span className="input-error">{errors.phone}</span>}
        </div>

        <div className="form-row">
          <label htmlFor="city">Ciudad</label>
          <input id="city" name="city" type="text" value={formData.city} onChange={handleChange} placeholder="Ej. Santiago" />
        </div>

        <div className="form-row">
          <label htmlFor="experience">Experiencia o comentario</label>
          <textarea id="experience" name="experience" value={formData.experience} onChange={handleChange} placeholder="Opcional: días disponibles, habilidades, etc." rows="4" />
        </div>

        {errors.form && <p className="text-error">{errors.form}</p>}

        <div className="form-actions">
          <button type="submit">Enviar inscripción</button>
          {submitted && <span className="form-success">Inscripción registrada correctamente.</span>}
        </div>
      </form>
    </section>
  )
}

export default RegisterVolunteer
