import { useState } from 'react'
import useLogin from '../hooks/useLogin'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.hostname}:3000` : 'http://localhost:3000')

function Login({ onSuccess, onClose }) {
  const [rut, setRut] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { errorRUT, errorPassword, errorData, handleInputChange } = useLogin()
  const [serverError, setServerError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rut, password })
      })
      const payload = await res.json()
      if (!res.ok) {
        const msg = payload?.message || 'Error en el inicio de sesión'
        errorData(msg)
        setServerError(msg)
        setLoading(false)
        return
      }
      const { data } = payload
      if (data?.token) {
        localStorage.setItem('token', data.token)
      }
      onSuccess && onSuccess(data?.user || null)
      setRut('')
      setPassword('')
      handleInputChange()
      onClose && onClose()
    } catch (err) {
      setServerError('Error de conexión al servidor')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-card">
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label htmlFor="rut">RUT</label>
          <input id="rut" name="rut" value={rut} onChange={(e) => { setRut(e.target.value); handleInputChange(e) }} />
          {errorRUT && <span className="input-error">{errorRUT}</span>}
        </div>
        <div className="form-row">
          <label htmlFor="password">Contraseña</label>
          <div className="password-field">
            <input id="password" name="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => { setPassword(e.target.value); handleInputChange(e) }} />
            <button type="button" className="password-toggle" onClick={() => setShowPassword((s) => !s)} aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
              {showPassword ? 'Ocultar' : 'Ver'}
            </button>
          </div>
          {errorPassword && <span className="input-error">{errorPassword}</span>}
        </div>
        {serverError && <p className="text-error">{serverError}</p>}
        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Ingresando...' : 'Ingresar'}</button>
          <button type="button" className="secondary" onClick={onClose}>Cerrar</button>
        </div>
      </form>
    </div>
  )
}

export default Login
