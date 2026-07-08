import { useEffect, useState } from 'react'
import { crearCuadrilla, editarCuadrilla, eliminarCuadrilla, obtenerCuadrillas } from '../services/cuadrilla.service'

function GestionarCuadrillas() {
  const [cuadrillas, setCuadrillas] = useState([])
  const [codigoSeleccionado, setCodigoSeleccionado] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  const loadCuadrillas = async () => {
    const result = await obtenerCuadrillas()
    if (result.success) {
      setCuadrillas(result.data)
    }
  }

  useEffect(() => {
    const cargarCuadrillas = async () => {
      const result = await obtenerCuadrillas()
      if (result.success) {
        setCuadrillas(result.data)
      }
      setLoading(false)
    }

    void cargarCuadrillas()
  }, [])

  const limpiarFormulario = () => {
    setCodigoSeleccionado('')
    setDescripcion('')
  }

  const seleccionarCuadrilla = (cuadrilla) => {
    setCodigoSeleccionado(String(cuadrilla.codigo))
    setDescripcion(cuadrilla.descripcion || '')
    setMessage('')
  }

  const guardarCuadrilla = async () => {
    setMessage('')

    if (!descripcion.trim()) {
      setMessage('La descripción es obligatoria.')
      return
    }

    const result = codigoSeleccionado
      ? await editarCuadrilla(codigoSeleccionado, { descripcion: descripcion.trim() })
      : await crearCuadrilla({ descripcion: descripcion.trim() })

    setMessage(result.success ? (codigoSeleccionado ? 'Cuadrilla actualizada correctamente.' : 'Cuadrilla creada correctamente.') : result.message)

    if (result.success) {
      await loadCuadrillas()
      limpiarFormulario()
    }
  }

  const eliminar = async (codigo) => {
    const confirmed = window.confirm(`¿Eliminar la cuadrilla ${codigo}?`)
    if (!confirmed) return

    const result = await eliminarCuadrilla(codigo)
    setMessage(result.success ? 'Cuadrilla eliminada correctamente.' : result.message)
    if (result.success) {
      await loadCuadrillas()
      if (String(codigoSeleccionado) === String(codigo)) {
        limpiarFormulario()
      }
    }
  }

  return (
    <section className="page-card">
      <h1>CRUD para Cuadrillas</h1>
      <p className="subtitle">Administración de cuadrillas disponible solo para administración.</p>

      <article className="detail-panel" style={{ marginBottom: '18px' }}>
        <h2>{codigoSeleccionado ? `Editar cuadrilla ${codigoSeleccionado}` : 'Crear nueva cuadrilla'}</h2>
        <div className="form-row">
          <label htmlFor="descripcionCuadrilla">Descripción</label>
          <input
            id="descripcionCuadrilla"
            value={descripcion}
            onChange={(event) => setDescripcion(event.target.value)}
            placeholder="Ej: Cuadrilla sector norte"
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn-primary" onClick={guardarCuadrilla}>
            {codigoSeleccionado ? 'Actualizar cuadrilla' : 'Crear cuadrilla'}
          </button>
          {codigoSeleccionado && (
            <button type="button" className="btn-outline" onClick={limpiarFormulario}>
              Cancelar edición
            </button>
          )}
        </div>
      </article>

      {loading ? (
        <p>Cargando cuadrillas...</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Descripción</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cuadrillas.map((cuadrilla) => (
                <tr key={cuadrilla.codigo}>
                  <td>{cuadrilla.codigo}</td>
                  <td>{cuadrilla.descripcion}</td>
                  <td>
                    <div className="inline-actions">
                      <button type="button" className="btn-outline" onClick={() => seleccionarCuadrilla(cuadrilla)}>
                        Editar
                      </button>
                      <button type="button" className="btn-danger" onClick={() => eliminar(cuadrilla.codigo)}>
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {cuadrillas.length === 0 && (
                <tr>
                  <td colSpan={3}>No hay cuadrillas registradas.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {message && <p className="helper-text">{message}</p>}
    </section>
  )
}

export default GestionarCuadrillas
