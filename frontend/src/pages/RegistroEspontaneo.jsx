import { useState, useEffect } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { canjearTokenExpress } from '../services/cuadrilla.service'

function RegistroDatosEspontaneo() {
  const location = useLocation()
  const navigate = useNavigate()

  // Recuperamos los datos validados de la pantalla anterior
  const { tokenEntregado, rutUsuario } = location.state || {}

  const [formData, setFormData] = useState({
    rut: rutUsuario || '',
    name: '',
    primerApellido: '',
    phone: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [passwordSimulada, setPasswordSimulada] = useState('')

  // Redirección de seguridad si intentan entrar sin pasar por el token
  useEffect(() => {
    if (!tokenEntregado || !rutUsuario) {
      navigate('/ingresar-token', { replace: true })
    }
  }, [tokenEntregado, rutUsuario, navigate])

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
    if (!formData.name.trim()) nextErrors.name = 'Nombre es obligatorio.'
    if (!formData.primerApellido.trim()) nextErrors.primerApellido = 'Primer apellido es obligatorio.'
    if (!formData.phone.trim()) nextErrors.phone = 'Teléfono es obligatorio.'

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setLoading(true)
    setErrors({})

    // Construimos la contraseña simulada según el patrón: nombre + Vol + 123 (ej: juanVol123)
    const nombreLimpio = formData.name.trim().toLowerCase().replace(/\s+/g, '')
    const passwordSimulada = `${nombreLimpio}123vol`

    // Estructura exacta solicitada por tu backend para el canje express
    const result = await canjearTokenExpress({
      tipoVoluntario: "Espontáneo",
      tokenEntregado: tokenEntregado,
      datosUsuarioNuevo: {
        rut: formData.rut,
        nombre: formData.name,
        primerApellido: formData.primerApellido,
        telefono: formData.phone
      }
    })

    setLoading(false)

    if (!result.success) {
      setSubmitted(false)
      setErrors({ form: result.message || 'Error al procesar el registro express' })
      return
    }

    // Guardamos la contraseña en el estado para mostrate en el label y cambiamos a vista éxito
    setPasswordSimulada(passwordSimulada)
    setSubmitted(true)
  }

  // Función que cumple el reenvío manual al hacer clic en Confirmar
  const handleConfirmarRedireccion = () => {
    navigate('/login')
  }

  return (
    <div className="public-shell">
      <section className="page-card">
        <div className="form-header">
          <h1>Registro de Datos - Voluntario Espontáneo</h1>
          <p className="subtitle">
            {!submitted 
              ? 'Completa tu perfil rápido para quedar asignado inmediatamente a tu cuadrilla.' 
              : '¡Registro completado con éxito!'}
          </p>
        </div>

        {!submitted ? (
          /* VISTA DEL FORMULARIO */
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-row">
              <label htmlFor="rut">RUT</label>
              <input 
                id="rut" 
                name="rut" 
                type="text" 
                value={formData.rut} 
                onChange={handleChange} 
                disabled 
              />
              {errors.rut && <span className="input-error">{errors.rut}</span>}
            </div>

            <div className="form-row">
              <label htmlFor="name">Nombre</label>
              <input 
                id="name" 
                name="name" 
                type="text" 
                value={formData.name} 
                onChange={handleChange} 
                placeholder="Ej. Juan" 
                required
              />
              {errors.name && <span className="input-error">{errors.name}</span>}
            </div>

            <div className="form-row">
              <label htmlFor="primerApellido">Primer apellido</label>
              <input 
                id="primerApellido" 
                name="primerApellido" 
                type="text" 
                value={formData.primerApellido} 
                onChange={handleChange} 
                placeholder="Ej. Pérez" 
                required
              />
              {errors.primerApellido && <span className="input-error">{errors.primerApellido}</span>}
            </div>

            <div className="form-row">
              <label htmlFor="phone">Teléfono móvil</label>
              <input 
                id="phone" 
                name="phone" 
                type="tel" 
                value={formData.phone} 
                onChange={handleChange} 
                placeholder="912345678" 
                required
              />
              {errors.phone && <span className="input-error">{errors.phone}</span>}
            </div>

            {errors.form && <p className="text-error">{errors.form}</p>}

            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Registrando...' : 'Finalizar Inscripción'}
              </button>
            </div>
          </form>
        ) : (
          /* VISTA DE ÉXITO CON LA CONTRASEÑA Y EL BOTÓN CONFIRMAR */
          <div className="success-token-box" style={{ marginTop: '20px' }}>
            <p className="form-success" style={{ fontSize: '1.1rem', marginBottom: '15px' }}>
              Tu cuenta ha sido creada y activada en la cuadrilla.
            </p>
            
            <div className="form-row" style={{ background: '#f5f5f5', padding: '15px', borderRadius: '6px', marginBottom: '20px' }}>
                <label style={{ fontWeight: 'bold', color: '#333', display: 'block', marginBottom: '5px' }}>
                    Tu contraseña provisoria de acceso es:
                </label>
            <label style={{ fontSize: '1.25rem', color: '#2ecc71', fontWeight: 'bold', letterSpacing: '0.5px' }}>
                {passwordSimulada}
            </label>
            
            {/* Label pequeño para mostrar el valor del Token / Código de Terreno */}
            <small style={{ display: 'block', marginTop: '10px', color: '#555', fontSize: '0.85rem' }}>
                Asignado correctamente mediante el código: <strong style={{ color: '#2c3e50' }}>{tokenEntregado}</strong>
            </small>
            
            <small style={{ display: 'block', marginTop: '5px', color: '#666' }}>
                Por favor, cópiala o recuérdala para iniciar sesión a continuación.
            </small>
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                className="btn-primary" 
                onClick={handleConfirmarRedireccion}
                style={{ width: '100%' }}
              >
                Confirmar e Ir al Login
              </button>
            </div>
          </div>
        )}

        {!submitted && (
          <p className="helper-text">¿Quieres volver? <Link to="/ingresar-token">Atrás</Link>.</p>
        )}
      </section>
    </div>
  )
}

export default RegistroDatosEspontaneo