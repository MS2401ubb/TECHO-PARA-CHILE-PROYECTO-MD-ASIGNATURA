import { useState } from 'react'
import { crearReporte } from '../services/request.service'
import { useAuth } from '../context/AuthContext'

function EnviarReporte() {
  const { token } = useAuth()
  const [form, setForm] = useState({
    titulo: '',
    contenido: '',
    areaOrganizacion: 'Voluntarios',
    urgencia: 'Media',
    categoria: 'Incidente',
    periodo: '',
  })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const onChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    setMessage('')
    setError('')

    const result = await crearReporte(form, token)
    if (!result.success) {
      setError(result.message || 'No fue posible enviar el reporte')
      return
    }

    setMessage('Reporte enviado correctamente.')
    setForm({
      titulo: '',
      contenido: '',
      areaOrganizacion: 'Voluntarios',
      urgencia: 'Media',
      categoria: 'Incidente',
      periodo: '',
    })
  }

  return (
    <section className="page-card">
      <h1>Enviar reporte</h1>
      <p className="subtitle">Formato estandar para Central.</p>

      <form onSubmit={onSubmit}>
        <div className="form-row">
          <label>Título</label>
          <input name="titulo" value={form.titulo} onChange={onChange} required />
        </div>
        <div className="form-row">
          <label>Contenido</label>
          <textarea name="contenido" value={form.contenido} onChange={onChange} rows={4} required />
        </div>
        <div className="form-row split-2">
          <div>
            <label>Área</label>
            <select name="areaOrganizacion" value={form.areaOrganizacion} onChange={onChange}>
              <option>Voluntarios</option>
              <option>Materiales</option>
              <option>Logistica</option>
              <option>Viviendas</option>
              <option>Jornadas</option>
              <option>Otro</option>
            </select>
          </div>
          <div>
            <label>Urgencia</label>
            <select name="urgencia" value={form.urgencia} onChange={onChange}>
              <option>Baja</option>
              <option>Media</option>
              <option>Alta</option>
              <option>Critica</option>
            </select>
          </div>
        </div>
        <div className="form-row split-2">
          <div>
            <label>Categoría</label>
            <select name="categoria" value={form.categoria} onChange={onChange} required>
              <option>Fin de Jornada</option>
              <option>Mensual</option>
              <option>Incidente</option>
              <option>Otro</option>
            </select>
          </div>
          <div>
            <label>Periodo (opcional)</label>
            <input name="periodo" value={form.periodo} onChange={onChange} />
          </div>
        </div>

        {error && <p className="text-error">{error}</p>}
        {message && <p className="text-success">{message}</p>}

        <div className="form-actions">
          <button type="submit" className="btn-primary">Enviar</button>
        </div>
      </form>
    </section>
  )
}

export default EnviarReporte
