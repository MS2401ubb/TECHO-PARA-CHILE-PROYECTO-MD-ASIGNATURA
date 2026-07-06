import { useState } from 'react'
import useLogin from '../hooks/useLogin'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.hostname}:3000` : 'http://localhost:3000')

function Login({ onSuccess, onClose }) {
  const [rut, setRut] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
<<<<<<< Updated upstream
=======
  const [error, setError] = useState('')
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
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
=======
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
            <div className="password-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 3L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10.58 10.58A3 3 0 0113.42 13.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14.12 14.12C12.94 14.98 11.54 15.5 10 15.5c-4.97 0-8.5-4.5-8.5-4.5C4 8 7.03 5 10 5c1.54 0 2.94.52 4.12 1.38" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error && <p className="text-error">{error}</p>}

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Ingresando...' : 'Ingresar'}
>>>>>>> Stashed changes
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
