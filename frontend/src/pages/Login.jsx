import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Login() {
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuth()
  const [rut, setRut] = useState('')
  const [password, setPassword] = useState('')
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
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
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
