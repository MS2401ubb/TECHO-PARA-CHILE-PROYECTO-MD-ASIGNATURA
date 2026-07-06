import { useState } from 'react'
import { Link } from 'react-router-dom'
import { enviarPostulacionVoluntario } from '../services/enroll.service'

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
    emergencyPhone: '',
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

  const handleSubmit = async (event) => {
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
    if (!formData.emergencyPhone.trim()) nextErrors.emergencyPhone = 'Teléfono de emergencia es obligatorio.'

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    const result = await enviarPostulacionVoluntario({
      rut: formData.rut,
      password: formData.password,
      nombre: formData.name,
      primerApellido: formData.primerApellido,
      segundoApellido: formData.segundoApellido,
      fechaNacimiento: formData.fechaNacimiento,
      email: formData.email,
      telefono: formData.phone,
      telefonoEmergencia: formData.emergencyPhone,
    })

    if (!result.success) {
      setSubmitted(false)
      setErrors({ form: result.message || 'Error al registrar' })
      return
    }

    setSubmitted(true)
    setFormData({
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
      emergencyPhone: '',
    })
  }

  return (
    <div className="public-shell">
      <section className="page-card">
        <div className="form-header">
          <h1>Formulario público de voluntariado</h1>
          <p className="subtitle">Tus datos quedan como Postulante y serán validados por Encargado de Voluntarios.</p>
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

          <div className="form-row split-2">
            <div>
              <label htmlFor="phone">Teléfono</label>
              <input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="912345678" />
              {errors.phone && <span className="input-error">{errors.phone}</span>}
            </div>
            <div>
              <label htmlFor="emergencyPhone">Teléfono de emergencia</label>
              <input id="emergencyPhone" name="emergencyPhone" type="tel" value={formData.emergencyPhone} onChange={handleChange} placeholder="998887776" />
              {errors.emergencyPhone && <span className="input-error">{errors.emergencyPhone}</span>}
            </div>
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
            <button type="submit" className="btn-primary">Enviar inscripción</button>
            {submitted && <span className="form-success">Inscripción registrada correctamente.</span>}
          </div>
        </form>

        <p className="helper-text">¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>.</p>
      </section>
    </div>
  )
}

export default RegisterVolunteer
