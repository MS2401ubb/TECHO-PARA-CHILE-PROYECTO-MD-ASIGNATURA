import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { actualizarEstadoReporte, listarReportes } from '../services/request.service'

function Reportes() {
  const { token } = useAuth()
  const [reportes, setReportes] = useState([])
  const [message, setMessage] = useState('')

  const prioridadEstado = (estado = '') => {
    const normalizado = estado === 'En Revision' ? 'En revisión' : estado
    const orden = { Recibido: 0, 'En revisión': 1, Resuelto: 2 }
    return orden[normalizado] ?? 99
  }

  const estiloEstado = (estado = '') => {
    const normalizado = estado === 'En Revision' ? 'En revisión' : estado
    const estilos = {
      Recibido: 'estado-badge estado-recibido',
      'En revisión': 'estado-badge estado-revision',
      Resuelto: 'estado-badge estado-resuelto',
    }
    return estilos[normalizado] || 'estado-badge'
  }

  const reportesOrdenados = [...reportes].sort((a, b) => {
    const diferencia = prioridadEstado(a.estado) - prioridadEstado(b.estado)
    if (diferencia !== 0) return diferencia
    return new Date(b.fechaEnvio) - new Date(a.fechaEnvio)
  })

  useEffect(() => {
    const loadReportes = async () => {
      const result = await listarReportes()
      if (result.success) setReportes(result.data)
    }

    loadReportes()
  }, [token])

  const cambiarEstado = async (id, estado) => {
    setMessage('')
    const result = await actualizarEstadoReporte(id, estado)
    setMessage(result.success ? 'Estado actualizado' : result.message)
    if (result.success) {
      const refreshed = await listarReportes()
      if (refreshed.success) setReportes(refreshed.data)
    }
  }

  return (
    <section className="page-card">
      <h1>Ver reportes</h1>
      <p className="subtitle">Reportes centralizados y priorizados por estado.</p>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Urgencia</th>
              <th>Estado</th>
              <th>Cambiar estado</th>
            </tr>
          </thead>
          <tbody>
            {reportesOrdenados.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.titulo}</td>
                <td>{item.urgencia}</td>
                <td><span className={estiloEstado(item.estado)}>{item.estado}</span></td>
                <td>
                  <select defaultValue={item.estado} onChange={(e) => cambiarEstado(item.id, e.target.value)}>
                    <option>Recibido</option>
                    <option>En Revision</option>
                    <option>Resuelto</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {message && <p className="helper-text">{message}</p>}
    </section>
  )
}

export default Reportes
