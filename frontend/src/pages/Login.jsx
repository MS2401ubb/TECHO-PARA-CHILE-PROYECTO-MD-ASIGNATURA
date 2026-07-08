import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Login() {
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuth()
  const [rut, setRut] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated) navigate('/home')
  }, [isAuthenticated, navigate])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    const result = await login(rut, password)
    setLoading(false)

    if (!result.success) {
      setError(result.message || 'No fue posible iniciar sesión')
      return
    }

    navigate('/home')
  }

  return (
    <div className="public-shell">
      <section className="auth-card">
        <h1>Ingreso Plataforma TECHO</h1>
        <p>Inicia sesión para entrar al panel operativo.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label htmlFor="rut">RUT</label>
            <input id="rut" value={rut} onChange={(e) => setRut(e.target.value)} required />
          </div>
          <div className="form-row">
            <label htmlFor="password">Contraseña</label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingRight: '44px' }}
              />
              <button
                type="button"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                onClick={() => setShowPassword((prev) => !prev)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M2 12C2 12 5.5 6 12 6C18.5 6 22 12 22 12" stroke="black" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M2 12C2 12 5.5 18 12 18C18.5 18 22 12 22 12" stroke="black" strokeWidth="1.8" strokeLinecap="round" />
                  <circle cx="12" cy="12" r="3" stroke="black" strokeWidth="1.8" />
                  {showPassword ? (
                    <path d="M3 3L21 21" stroke="black" strokeWidth="1.8" strokeLinecap="round" />
                  ) : null}
                </svg>
              </button>
            </div>
          </div>

          {error && <p className="text-error">{error}</p>}

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </div>
        </form>

        <p className="helper-text">
          ¿Quieres postular como voluntario? <Link to="/postulacion-voluntario">Completa el formulario público</Link>.<br></br>
          ¿Estas entrando como voluntario espontaneo? <Link to="/ingresar-token">Canjea el token recibido aca</Link>.
        </p>
      </section>
    </div>
  )
}

export default Login
