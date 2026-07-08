import { useEffect, useState } from 'react'
import { autorizarCierreJornada, obtenerViviendasBloqueadas } from '../services/logistica.service'

function ViviendasBloqueadas() {
  const [bloqueos, setBloqueos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [jornadaProcesando, setJornadaProcesando] = useState(null)

  const cargarBloqueos = async () => {
    setCargando(true)
    setError('')
    const result = await obtenerViviendasBloqueadas()

    if (!result.success) {
      setError(result.message || 'No fue posible cargar las viviendas bloqueadas.')
      setBloqueos([])
      setCargando(false)
      return
    }

    setBloqueos(result.data || [])
    setCargando(false)
  }

  useEffect(() => {
    cargarBloqueos()
  }, [])

  const autorizarCierre = async (jornadaId) => {
    setMensaje('')
    setError('')
    setJornadaProcesando(jornadaId)

    const result = await autorizarCierreJornada(jornadaId)
    if (!result.success) {
      setError(result.message || 'No se pudo autorizar el cierre.')
      setJornadaProcesando(null)
      return
    }

    setMensaje(result.message || 'Cierre autorizado correctamente.')
    setBloqueos((current) => current.filter((bloqueo) => bloqueo.jornadaId !== jornadaId))
    setJornadaProcesando(null)
  }

  return (
    <section className="page-card">
      <h1>Viviendas Bloqueadas</h1>
      <p className="subtitle">Revisa jornadas bloqueadas por pérdida de herramientas y autoriza su cierre desde Central.</p>

      {mensaje && <p className="text-success calc-status approved">{mensaje}</p>}
      {error && <p className="text-error calc-status rejected">{error}</p>}
      {cargando && <p className="helper-text">Cargando viviendas bloqueadas...</p>}
      {!cargando && bloqueos.length === 0 && <p className="helper-text">No hay viviendas bloqueadas pendientes de autorización.</p>}

      <div className="cards-grid">
        {bloqueos.map((bloqueo) => (
          <article key={bloqueo.jornadaId} className="card">
            <h2>Vivienda {bloqueo.codigoVivienda}</h2>
            <p><strong>Jornada:</strong> {bloqueo.jornadaId}</p>
            <p><strong>Dirección:</strong> {bloqueo.direccionVivienda}</p>
            <p><strong>Observación del jefe:</strong> {bloqueo.observacionJefe}</p>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Herramienta</th>
                    <th>Pérdida</th>
                    <th>Incidencia</th>
                  </tr>
                </thead>
                <tbody>
                  {bloqueo.herramientasPerdidas.map((herramienta) => (
                    <tr key={`${bloqueo.jornadaId}-${herramienta.id_herramienta}`}>
                      <td>{herramienta.nombre_herramienta}</td>
                      <td>{herramienta.cantidad_perdida}</td>
                      <td>{herramienta.incidencia}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="inline-actions">
              <button
                type="button"
                className="btn-primary"
                onClick={() => autorizarCierre(bloqueo.jornadaId)}
                disabled={jornadaProcesando === bloqueo.jornadaId}
              >
                {jornadaProcesando === bloqueo.jornadaId ? 'Autorizando...' : 'Autorizar cierre'}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default ViviendasBloqueadas
