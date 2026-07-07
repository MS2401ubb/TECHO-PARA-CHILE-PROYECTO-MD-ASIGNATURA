import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { descargarDocumentoTransporte } from '../services/logistica.service'

function LogisticaTransporte() {
  const { token } = useAuth()
  const [form, setForm] = useState({ codigoCiudad: '', trasladoPuntoOrigen: '' })
  const [message, setMessage] = useState('')

  const onSubmit = async (event) => {
    event.preventDefault()
    setMessage('')
    const result = await descargarDocumentoTransporte(token, {
      codigoCiudad: Number(form.codigoCiudad),
      trasladoPuntoOrigen: form.trasladoPuntoOrigen,
    })
    setMessage(result.success ? 'Documento generado y descargado.' : result.message)
  }

  return (
    <section className="page-card">
      <h1>Logística transporte</h1>
      <p className="subtitle">Generación de manifiesto de carga (RF11).</p>

      <form onSubmit={onSubmit}>
        <div className="form-row split-2">
          <div>
            <label>Código ciudad</label>
            <input value={form.codigoCiudad} onChange={(e) => setForm((p) => ({ ...p, codigoCiudad: e.target.value }))} required />
          </div>
          <div>
            <label>Punto de origen</label>
            <input value={form.trasladoPuntoOrigen} onChange={(e) => setForm((p) => ({ ...p, trasladoPuntoOrigen: e.target.value }))} required />
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-primary">Generar PDF</button>
        </div>
      </form>

      {message && <p className="helper-text">{message}</p>}
    </section>
  )
}

export default LogisticaTransporte
