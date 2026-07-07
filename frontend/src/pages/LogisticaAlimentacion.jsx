import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { descargarDocumentoAlimentacion } from '../services/logistica.service'

function LogisticaAlimentacion() {
  const { token, user } = useAuth()
  const [form, setForm] = useState({ codigoVivienda: '', rutEncargado: user?.rut || '' })
  const [message, setMessage] = useState('')

  const onSubmit = async (event) => {
    event.preventDefault()
    setMessage('')
    const result = await descargarDocumentoAlimentacion(token, form)
    setMessage(result.success ? 'Documento generado y descargado.' : result.message)
  }

  return (
    <section className="page-card">
      <h1>Logística alimentación</h1>
      <p className="subtitle">Cálculo de raciones y documento oficial (RF4).</p>

      <form onSubmit={onSubmit}>
        <div className="form-row split-2">
          <div>
            <label>Código vivienda</label>
            <input value={form.codigoVivienda} onChange={(e) => setForm((p) => ({ ...p, codigoVivienda: e.target.value }))} required />
          </div>
          <div>
            <label>RUT encargado</label>
            <input value={form.rutEncargado} onChange={(e) => setForm((p) => ({ ...p, rutEncargado: e.target.value }))} required />
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

export default LogisticaAlimentacion
