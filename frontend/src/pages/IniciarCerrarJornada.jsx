import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  crearJornadaConTareas,
  crearTareaValidacionJornada,
  obtenerInventarioJornada,
  cerrarJornada,
  obtenerTareasValidacionJornada,
  marcarTareaValidacion,
  confirmarValidacionTecnica,
} from '../services/logistica.service'

function IniciarCerrarJornada() {
  const [searchParams] = useSearchParams()
  const [codigoCuadrilla, setCodigoCuadrilla] = useState(searchParams.get('codigoCuadrilla') || '')
  const [idJornadaTareas, setIdJornadaTareas] = useState('')
  const [descripcionTarea, setDescripcionTarea] = useState('')
  const [observacionesTarea, setObservacionesTarea] = useState('')
  const [listaTareasJornada, setListaTareasJornada] = useState([])
  const [cargandoTareas, setCargandoTareas] = useState(false)
  const [enviandoTarea, setEnviandoTarea] = useState(false)
  const [mensajeTareas, setMensajeTareas] = useState('')
  const [errorTareas, setErrorTareas] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [resultado, setResultado] = useState(null)
  const [idJornadaCierre, setIdJornadaCierre] = useState('')
  const [inventarioCierre, setInventarioCierre] = useState([])
  const [cargandoInventario, setCargandoInventario] = useState(false)
  const [enviandoCierre, setEnviandoCierre] = useState(false)
  const [tareasCierre, setTareasCierre] = useState([])
  const [confirmandoValidacion, setConfirmandoValidacion] = useState(false)
  const [mensajeCierre, setMensajeCierre] = useState('')
  const [errorCierre, setErrorCierre] = useState('')
  const [resultadoCierre, setResultadoCierre] = useState(null)
  const [observacionesCierre, setObservacionesCierre] = useState('')

  const crearJornada = async () => {
    setMensaje('')
    setError('')
    setResultado(null)

    if (!codigoCuadrilla || Number(codigoCuadrilla) <= 0) {
      setError('Debes ingresar un codigo de cuadrilla valido. Solo numeros positivos.')
      return
    }

    setEnviando(true)

    const result = await crearJornadaConTareas({
      codigo_cuadrilla: Number(codigoCuadrilla),
    })

    if (result.success) {
      setResultado(result.data)
      setIdJornadaTareas(String(result.data?.jornadaId || ''))
      setMensaje(result.message || 'Jornada creada exitosamente.')
      setEnviando(false)
      return
    }

    setError(result.message || 'No se pudo crear la jornada.')
    setEnviando(false)
  }

  const cargarTareasJornada = async () => {
    setMensajeTareas('')
    setErrorTareas('')
    setListaTareasJornada([])

    if (!idJornadaTareas || Number(idJornadaTareas) <= 0) {
      setErrorTareas('Debes ingresar un id de jornada valido para ver tareas.')
      return
    }

    setCargandoTareas(true)
    const result = await obtenerTareasValidacionJornada(Number(idJornadaTareas))
    if (!result.success) {
      setErrorTareas(result.message || 'No se pudieron cargar las tareas de la jornada.')
      setCargandoTareas(false)
      return
    }

    setListaTareasJornada(result.data || [])
    setCargandoTareas(false)
  }

  const agregarTareaJornada = async () => {
    setMensajeTareas('')
    setErrorTareas('')

    if (!idJornadaTareas || Number(idJornadaTareas) <= 0) {
      setErrorTareas('Debes ingresar un id de jornada valido.')
      return
    }

    if (!descripcionTarea.trim() || descripcionTarea.trim().length < 3) {
      setErrorTareas('La descripcion de la tarea debe tener al menos 3 caracteres.')
      return
    }

    setEnviandoTarea(true)
    const body = {
      descripcion: descripcionTarea.trim(),
      ...(observacionesTarea.trim() ? { observaciones: observacionesTarea.trim() } : {}),
    }

    const result = await crearTareaValidacionJornada(Number(idJornadaTareas), body)
    if (!result.success) {
      setErrorTareas(result.message || 'No se pudo crear la tarea.')
      setEnviandoTarea(false)
      return
    }

    setDescripcionTarea('')
    setObservacionesTarea('')
    setMensajeTareas(result.message || 'Tarea creada exitosamente.')

    const tareasActualizadas = await obtenerTareasValidacionJornada(Number(idJornadaTareas))
    if (tareasActualizadas.success) {
      setListaTareasJornada(tareasActualizadas.data || [])
    }

    setEnviandoTarea(false)
  }

  const cargarInventario = async () => {
    setMensajeCierre('')
    setErrorCierre('')
    setResultadoCierre(null)
    setInventarioCierre([])
    setTareasCierre([])

    if (!idJornadaCierre || Number(idJornadaCierre) <= 0) {
      setErrorCierre('Debes ingresar un id de jornada valido para cargar el inventario.')
      return
    }

    setCargandoInventario(true)
    const [inventarioResult, tareasResult] = await Promise.all([
      obtenerInventarioJornada(Number(idJornadaCierre)),
      obtenerTareasValidacionJornada(Number(idJornadaCierre)),
    ])

    if (inventarioResult.success) {
      const herramientas = inventarioResult.data?.herramientas || []
      setInventarioCierre(
        herramientas.map((item) => ({
          id_herramienta: item.id_herramienta,
          nombre_herramienta: item.nombre_herramienta,
          cantidad_inicial: Number(item.cantidad_inicial) || 0,
          cantidad_fisica_final: item.cantidad_fisica_final ?? item.cantidad_inicial,
          incidencia: item.incidencia || '',
        }))
      )
      setMensajeCierre(inventarioResult.message || 'Inventario cargado.')
    }

    if (tareasResult.success) {
      setTareasCierre(tareasResult.data || [])
    }

    if (inventarioResult.success) {
      setCargandoInventario(false)
      return
    }

    setErrorCierre(inventarioResult.message || 'No se pudo cargar el inventario de la jornada.')
    setCargandoInventario(false)
  }

  const actualizarHerramientaCierre = (index, field, value) => {
    setInventarioCierre((current) =>
      current.map((item, idx) => (idx === index ? { ...item, [field]: value } : item))
    )
  }

  const actualizarEstadoTarea = async (idTarea, marcar) => {
    setMensajeCierre('')
    setErrorCierre('')

    const result = await marcarTareaValidacion(Number(idJornadaCierre), idTarea, marcar)
    if (!result.success) {
      setErrorCierre(result.message || 'No se pudo actualizar la tarea.')
      return
    }

    setTareasCierre((current) =>
      current.map((tarea) =>
        tarea.id === idTarea
          ? {
              ...tarea,
              estado: marcar ? 'COMPLETADO' : 'PENDIENTE',
              confirmado: false,
              fecha_completado: result.data?.fecha_completado || tarea.fecha_completado,
            }
          : tarea
      )
    )
  }

  const bloquearValidacionTecnica = async () => {
    setMensajeCierre('')
    setErrorCierre('')
    setConfirmandoValidacion(true)

    const result = await confirmarValidacionTecnica(Number(idJornadaCierre))
    if (!result.success) {
      setErrorCierre(result.message || 'No se pudo confirmar la validacion tecnica.')
      setConfirmandoValidacion(false)
      return false
    }

    setTareasCierre((current) => current.map((tarea) => ({ ...tarea, confirmado: true })))
    setMensajeCierre(result.message || 'Validacion tecnica confirmada.')
    setConfirmandoValidacion(false)
    return true
  }

  const enviarCierreJornada = async () => {
    setMensajeCierre('')
    setErrorCierre('')
    setResultadoCierre(null)

    if (!idJornadaCierre || Number(idJornadaCierre) <= 0) {
      setErrorCierre('Debes ingresar un id de jornada valido.')
      return
    }

    if (inventarioCierre.length === 0) {
      setErrorCierre('Debes cargar el inventario inicial de la jornada antes de cerrar.')
      return
    }

    if (tareasCierre.length === 0) {
      setErrorCierre('La jornada no tiene tareas cargadas para validar.')
      return
    }

    const tareasPendientes = tareasCierre.filter((tarea) => tarea.estado !== 'COMPLETADO')
    if (tareasPendientes.length > 0) {
      setErrorCierre('Debes dejar todas las tareas en completado antes de cerrar la jornada.')
      return
    }

    const validacionConfirmada = tareasCierre.every((tarea) => tarea.confirmado)
    if (!validacionConfirmada) {
      const confirmacionExitosa = await bloquearValidacionTecnica()
      if (!confirmacionExitosa) {
        return
      }
    }

    const herramientas = inventarioCierre.map((item) => ({
      id_herramienta: Number(item.id_herramienta),
      cantidad_fisica_final: Number(item.cantidad_fisica_final),
      incidencia: item.incidencia?.trim() || '',
    }))

    const tieneCantidadInvalida = herramientas.some((item) => !Number.isInteger(item.cantidad_fisica_final) || item.cantidad_fisica_final < 0)
    if (tieneCantidadInvalida) {
      setErrorCierre('Todas las cantidades finales deben ser enteros mayores o iguales a 0.')
      return
    }

    setEnviandoCierre(true)
    const result = await cerrarJornada(Number(idJornadaCierre), {
      montajeEstructural: true,
      habilidadTecnica: true,
      conexionesBasicas: true,
      observaciones: observacionesCierre,
      herramientas,
    })

    if (result.success) {
      setResultadoCierre(result.data)
      setMensajeCierre(result.message || 'Cierre de jornada enviado correctamente.')
      setEnviandoCierre(false)
      return
    }

    setErrorCierre(result.message || 'No se pudo cerrar la jornada.')
    setResultadoCierre(result.data)
    setEnviandoCierre(false)
  }

  return (
    <section className="page-card">
      <h1>Iniciar / cerrar jornada</h1>
      <p className="subtitle">Primero crea la jornada, luego registra sus tareas en el apartado independiente.</p>

      <div className="form-row">
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

      <div className="inline-actions">
        <button type="button" className="btn-primary" onClick={crearJornada} disabled={enviando}>
          {enviando ? 'Creando...' : 'Crear jornada'}
        </button>
      </div>

      {mensaje && <p className="text-success calc-status approved">{mensaje}</p>}
      {error && <p className="text-error calc-status rejected">{error}</p>}

      {resultado && (
        <article className="detail-panel">
          <h2>Resumen de creacion</h2>
          <p><strong>Mensaje:</strong> {resultado.mensaje}</p>
          <p><strong>Jornada:</strong> {resultado.jornadaId}</p>
          <p><strong>Cuadrilla:</strong> {resultado.codigoCuadrilla}</p>
          <p><strong>Vivienda:</strong> {resultado.codigoVivienda}</p>
        </article>
      )}

      <hr className="section-divider" />

      <h2>Ingreso de tareas de la jornada</h2>
      <p className="subtitle">Registra las tareas por hacer luego de crear la jornada.</p>

      <div className="form-row split-2">
        <div>
          <label htmlFor="idJornadaTareas">Id de jornada</label>
          <input
            id="idJornadaTareas"
            type="number"
            min="1"
            value={idJornadaTareas}
            onChange={(event) => setIdJornadaTareas(event.target.value)}
            placeholder="Ej: 12"
          />
        </div>
        <div className="inline-actions aligned-bottom">
          <button type="button" className="btn-outline" onClick={cargarTareasJornada} disabled={cargandoTareas}>
            {cargandoTareas ? 'Cargando tareas...' : 'Ver tareas de la jornada'}
          </button>
        </div>
      </div>

      <div className="form-row">
        <label htmlFor="descripcionTarea">Descripcion de tarea</label>
        <textarea
          id="descripcionTarea"
          rows="2"
          value={descripcionTarea}
          onChange={(event) => setDescripcionTarea(event.target.value)}
          placeholder="Ej: Revisar estructura base"
        />
      </div>

      <div className="form-row">
        <label htmlFor="observacionesTarea">Observaciones (opcional)</label>
        <textarea
          id="observacionesTarea"
          rows="2"
          value={observacionesTarea}
          onChange={(event) => setObservacionesTarea(event.target.value)}
          placeholder="Ej: Prioridad alta"
        />
      </div>

      <div className="inline-actions">
        <button type="button" className="btn-primary" onClick={agregarTareaJornada} disabled={enviandoTarea}>
          {enviandoTarea ? 'Agregando...' : 'Agregar tarea'}
        </button>
      </div>

      {mensajeTareas && <p className="text-success calc-status approved">{mensajeTareas}</p>}
      {errorTareas && <p className="text-error calc-status rejected">{errorTareas}</p>}

      {listaTareasJornada.length > 0 && (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Descripcion</th>
                <th>Observaciones</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {listaTareasJornada.map((tarea) => (
                <tr key={`tarea-ingreso-${tarea.id}`}>
                  <td>{tarea.descripcion}</td>
                  <td>{tarea.observaciones || 'Sin observaciones'}</td>
                  <td>{tarea.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <hr className="section-divider" />

      <h2>Cierre de jornada</h2>
      <p className="subtitle">Carga el inventario inicial y las tareas de la jornada, márcalas como completadas y luego registra el conteo fisico final.</p>

      <div className="form-row split-2">
        <div>
          <label htmlFor="idJornadaCierre">Id de jornada</label>
          <input
            id="idJornadaCierre"
            type="number"
            min="1"
            value={idJornadaCierre}
            onChange={(event) => setIdJornadaCierre(event.target.value)}
            placeholder="Ej: 12"
          />
        </div>
        <div className="inline-actions aligned-bottom">
          <button type="button" className="btn-outline" onClick={cargarInventario} disabled={cargandoInventario}>
            {cargandoInventario ? 'Cargando inventario...' : 'Cargar inventario inicial'}
          </button>
        </div>
      </div>

      {inventarioCierre.length > 0 && (
        <>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Herramienta</th>
                  <th>Cantidad inicial</th>
                  <th>Cantidad fisica final</th>
                  <th>Diferencia</th>
                  <th>Incidencia (si falta)</th>
                </tr>
              </thead>
              <tbody>
                {inventarioCierre.map((item, index) => {
                  const final = Number(item.cantidad_fisica_final) || 0
                  const diferencia = item.cantidad_inicial - final
                  return (
                    <tr key={`inventario-cierre-${item.id_herramienta}`}>
                      <td>{item.nombre_herramienta}</td>
                      <td>{item.cantidad_inicial}</td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          value={item.cantidad_fisica_final}
                          onChange={(event) => actualizarHerramientaCierre(index, 'cantidad_fisica_final', event.target.value)}
                        />
                      </td>
                      <td>
                        <span className={`result-pill ${diferencia === 0 ? 'ok' : 'warn'}`}>
                          {diferencia === 0 ? 'Sin diferencia' : `Faltan ${diferencia}`}
                        </span>
                      </td>
                      <td>
                        <input
                          type="text"
                          value={item.incidencia}
                          onChange={(event) => actualizarHerramientaCierre(index, 'incidencia', event.target.value)}
                          placeholder="Obligatoria si hay faltante"
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <h3>Tareas de la jornada</h3>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Descripcion</th>
                  <th>Observaciones</th>
                  <th>Estado</th>
                  <th>Confirmada</th>
                  <th>Accion</th>
                </tr>
              </thead>
              <tbody>
                {tareasCierre.map((tarea) => (
                  <tr key={`tarea-cierre-${tarea.id}`}>
                    <td>{tarea.descripcion}</td>
                    <td>{tarea.observaciones || 'Sin observaciones'}</td>
                    <td>
                      <span className={`result-pill ${tarea.estado === 'COMPLETADO' ? 'ok' : 'warn'}`}>
                        {tarea.estado}
                      </span>
                    </td>
                    <td>{tarea.confirmado ? 'Si' : 'No'}</td>
                    <td>
                      <button
                        type="button"
                        className="btn-outline"
                        onClick={() => actualizarEstadoTarea(tarea.id, tarea.estado !== 'COMPLETADO')}
                        disabled={tarea.confirmado}
                      >
                        {tarea.estado === 'COMPLETADO' ? 'Marcar pendiente' : 'Marcar completado'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="inline-actions">
            <button
              type="button"
              className="btn-outline"
              onClick={bloquearValidacionTecnica}
              disabled={confirmandoValidacion || tareasCierre.length === 0}
            >
              {confirmandoValidacion ? 'Confirmando validacion...' : 'Confirmar validacion tecnica'}
            </button>
          </div>

          <div className="form-row">
            <label htmlFor="observacionesCierre">Observaciones de cierre (opcional)</label>
            <textarea
              id="observacionesCierre"
              rows="3"
              value={observacionesCierre}
              onChange={(event) => setObservacionesCierre(event.target.value)}
            />
          </div>

          <div className="inline-actions">
            <button type="button" className="btn-primary" onClick={enviarCierreJornada} disabled={enviandoCierre}>
              {enviandoCierre ? 'Cerrando...' : 'Cerrar jornada'}
            </button>
          </div>
        </>
      )}

      {mensajeCierre && <p className="text-success calc-status approved">{mensajeCierre}</p>}
      {errorCierre && <p className="text-error calc-status rejected">{errorCierre}</p>}

      {resultadoCierre && (
        <article className="detail-panel">
          <h2>Resultado de cierre</h2>
          {resultadoCierre.estado && <p><strong>Estado:</strong> {resultadoCierre.estado}</p>}
          {resultadoCierre.jornadaId && <p><strong>Jornada:</strong> {resultadoCierre.jornadaId}</p>}
          {resultadoCierre.mensaje && <p><strong>Mensaje:</strong> {resultadoCierre.mensaje}</p>}
          {Array.isArray(resultadoCierre.detalles_descuadre) && resultadoCierre.detalles_descuadre.length > 0 && (
            <p><strong>Descuadres detectados:</strong> {resultadoCierre.detalles_descuadre.length}</p>
          )}
        </article>
      )}
    </section>
  )
}

export default IniciarCerrarJornada
