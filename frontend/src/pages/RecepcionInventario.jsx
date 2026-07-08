import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { confirmarRecepcionInventario, obtenerHerramientasAutorizadasRecepcion } from '../services/logistica.service'

function RecepcionInventario() {
  const [searchParams] = useSearchParams()
  const [codigoCuadrilla, setCodigoCuadrilla] = useState(searchParams.get('codigoCuadrilla') || '')
  const [idJornada, setIdJornada] = useState('')
  const [herramientasAutorizadas, setHerramientasAutorizadas] = useState([])
  const [cargandoAutorizadas, setCargandoAutorizadas] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [resultado, setResultado] = useState(null)

  const detallesHerramientas = useMemo(() => {
    if (!resultado?.data && !resultado?.mensaje) return []
    return herramientasAutorizadas
  }, [resultado, herramientasAutorizadas])

  const cargarHerramientasAutorizadas = async () => {
    setMensaje('')
    setError('')
    setResultado(null)
    setHerramientasAutorizadas([])

    if (!idJornada || Number(idJornada) <= 0) {
      setError('Debes ingresar un id de jornada valido.')
      return
    }

    if (!codigoCuadrilla || Number(codigoCuadrilla) <= 0) {
      setError('Debes ingresar un codigo de cuadrilla valido.')
      return
    }

    setCargandoAutorizadas(true)
    const result = await obtenerHerramientasAutorizadasRecepcion(Number(idJornada), Number(codigoCuadrilla))
    if (!result.success) {
      setError(result.message || 'No fue posible cargar las herramientas autorizadas por Central.')
      setCargandoAutorizadas(false)
      return
    }

    setHerramientasAutorizadas(result.data?.herramientas || [])
    setMensaje(result.message || 'Herramientas autorizadas cargadas.')
    setCargandoAutorizadas(false)
  }

  const confirmarRecepcion = async () => {
    setMensaje('')
    setError('')
    setResultado(null)

    if (!idJornada || Number(idJornada) <= 0) {
      setError('Debes ingresar un id de jornada valido.')
      return
    }

    if (!codigoCuadrilla || Number(codigoCuadrilla) <= 0) {
      setError('Debes ingresar un codigo de cuadrilla valido.')
      return
    }

    const herramientasLimpias = herramientasAutorizadas
      .map((item) => ({
        id_herramienta: Number(item.id_herramienta),
        cantidad_inicial: Number(item.cantidad_asignada),
      }))
      .filter((item) => item.id_herramienta > 0 && item.cantidad_inicial > 0)

    if (herramientasLimpias.length === 0) {
      setError('La Central no ha hecho el envio de herramientas para esta cuadrilla.')
      return
    }

    setEnviando(true)
    const result = await confirmarRecepcionInventario(Number(idJornada), {
      codigo_cuadrilla: Number(codigoCuadrilla),
      herramientas: herramientasLimpias,
    })

    if (result.success) {
      setResultado(result.data)
      setMensaje(result.message || 'Recepcion de inventario confirmada exitosamente.')
      setEnviando(false)
      return
    }

    setError(result.message || 'No se pudo confirmar la recepcion de inventario.')
    setEnviando(false)
  }

  return (
    <section className="page-card">
      <h1>Recepcion de inventario</h1>
      <p className="subtitle">Registra el stock inicial de la jornada antes de salir a terreno.</p>

      <div className="form-row split-2">
        <div>
          <label htmlFor="idJornada">Id de jornada</label>
          <input
            id="idJornada"
            type="number"
            min="1"
            value={idJornada}
            onChange={(event) => setIdJornada(event.target.value)}
            placeholder="Ej: 12"
          />
        </div>
        <div>
          <label htmlFor="codigoCuadrilla">Codigo de cuadrilla</label>
          <input
            id="codigoCuadrilla"
            type="number"
            min="1"
            value={codigoCuadrilla}
            onChange={(event) => setCodigoCuadrilla(event.target.value)}
            placeholder="Ej: 1"
          />
        </div>
      </div>

      <h2>Herramientas autorizadas por Central</h2>

      {herramientasAutorizadas.length > 0 ? (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Herramienta</th>
                <th>Cantidad autorizada</th>
              </tr>
            </thead>
            <tbody>
              {herramientasAutorizadas.map((item) => (
                <tr key={`herramienta-autorizada-${item.id_herramienta}`}>
                  <td>{item.nombre_herramienta}</td>
                  <td>{item.cantidad_asignada}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="helper-text">Primero carga las herramientas autorizadas para esta jornada.</p>
      )}

      <div className="inline-actions">
        <button type="button" className="btn-outline" onClick={cargarHerramientasAutorizadas} disabled={cargandoAutorizadas}>
          {cargandoAutorizadas ? 'Cargando...' : 'Cargar herramientas de Central'}
        </button>
        <button type="button" className="btn-primary" onClick={confirmarRecepcion} disabled={enviando}>
          {enviando ? 'Confirmando...' : 'Confirmar recepcion'}
        </button>
      </div>

      {mensaje && <p className="text-success calc-status approved">{mensaje}</p>}
      {error && <p className="text-error calc-status rejected">{error}</p>}

      {resultado && (
        <article className="detail-panel">
          <h2>Resumen de recepcion</h2>
          <p><strong>Mensaje:</strong> {resultado.mensaje}</p>
          <p><strong>Jornada:</strong> {resultado.jornadaId}</p>
          <p><strong>Cuadrilla:</strong> {resultado.codigoCuadrilla}</p>
          {Array.isArray(detallesHerramientas) && detallesHerramientas.length > 0 && (
            <p><strong>Herramientas registradas:</strong> {detallesHerramientas.length}</p>
          )}
        </article>
      )}
    </section>
  )
}

export default RecepcionInventario