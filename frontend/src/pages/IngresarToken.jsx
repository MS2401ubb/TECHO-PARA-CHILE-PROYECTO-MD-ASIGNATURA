import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { validarTokenExpress } from '../services/auth.service'

function IngresarToken() {
  const navigate = useNavigate()
  const [rut, setRut] = useState('')
  const [token, setToken] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    const result = await validarTokenExpress(token)
    setLoading(false)

    if (!result.success) {
      setError(result.message || 'No fue posible encontrar Token')
      return
    }

    navigate('/registro-datos-express', {
      state: {
        tokenEntregado: token,
        rutUsuario: rut,
      }
    })
  }

  return (
    <div className="public-shell">
      <section className="auth-card">
        <h1>Ingreso en Terreno a Plataforma TECHO</h1>
        <p>Canjea token para entrar al panel operativo.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label htmlFor="rut">RUT</label>
            <input id="rut" value={rut} onChange={(e) => setRut(e.target.value)} required />
          </div>
          <div className="form-row">
            <label htmlFor="tokenCuadrilla">Token Cuadrilla</label>
            <input id="tokenCuadrilla" value={token} onChange={(e) => setToken(e.target.value)} required />
          </div>

          {error && <p className="text-error">{error}</p>}

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </div>
        </form>
        <p className="helper-text">
          ¿Quieres volver a página Login? <Link to="/login">Apreta aca</Link>.
        </p>
      </section>
    </div>
  )
}

export default IngresarToken
