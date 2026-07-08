import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { obtenerCatalogoHerramientas, validarSuficienciaHerramientas } from '../services/logistica.service'

function CalculoHerramientas() {
  const [searchParams] = useSearchParams()
  const [codigoCuadrilla, setCodigoCuadrilla] = useState(searchParams.get('codigoCuadrilla') || '')
  const [codigoVivienda, setCodigoVivienda] = useState(searchParams.get('codigoVivienda') || '')
  const [herramientasCatalogo, setHerramientasCatalogo] = useState([])
  const [herramientasInput, setHerramientasInput] = useState([{ id_herramienta: '', cantidad_asignada: 1 }])
  const [cargandoCatalogo, setCargandoCatalogo] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [resultado, setResultado] = useState(null)

  useEffect(() => {
    const cargarCatalogo = async () => {
      setCargandoCatalogo(true)
      const result = await obtenerCatalogoHerramientas()

      if (result.success) {
        setHerramientasCatalogo(result.data)
      } else {
        setError(result.message || 'No fue posible cargar el catalogo de herramientas.')
      }

      setCargandoCatalogo(false)
    }

    cargarCatalogo()
  }, [])

  const herramientasConNombre = useMemo(() => {
    if (!resultado?.detalle) return []

    return resultado.detalle.map((item) => {
      const catalogoItem = herramientasCatalogo.find((herramienta) => herramienta.id === item.id_herramienta)
      return {
        ...item,
        nombre_herramienta: item.nombre_herramienta || catalogoItem?.nombre || `Herramienta ${item.id_herramienta}`,
      }
    })
  }, [resultado, herramientasCatalogo])

  const actualizarFilaHerramienta = (index, field, value) => {
    setHerramientasInput((current) =>
      current.map((item, idx) => (idx === index ? { ...item, [field]: value } : item))
    )
  }

  const agregarFilaHerramienta = () => {
    setHerramientasInput((current) => [...current, { id_herramienta: '', cantidad_asignada: 1 }])
  }

  const eliminarFilaHerramienta = (index) => {
    setHerramientasInput((current) => {
      if (current.length === 1) return current
      return current.filter((_, idx) => idx !== index)
    })
  }

  const validarStock = async () => {
    setMensaje('')
    setError('')
    setResultado(null)

    if (!codigoCuadrilla || Number(codigoCuadrilla) <= 0) {
      setError('Debes ingresar un codigo de cuadrilla valido.')
      return
    }

    if (!codigoVivienda.trim()) {
      setError('Debes ingresar un codigo de vivienda.')
      return
    }

    const herramientasLimpias = herramientasInput
      .filter((item) => item.id_herramienta)
      .map((item) => ({
        id_herramienta: Number(item.id_herramienta),
        cantidad_asignada: Number(item.cantidad_asignada),
      }))
      .filter((item) => item.id_herramienta > 0 && item.cantidad_asignada > 0)

    if (herramientasLimpias.length === 0) {
      setError('Debes ingresar al menos una herramienta con cantidad mayor a 0.')
      return
    }

    setEnviando(true)

    const result = await validarSuficienciaHerramientas({
      codigo_cuadrilla: Number(codigoCuadrilla),
      codigo_vivienda: codigoVivienda.trim(),
      herramientas: herramientasLimpias,
    })

    if (result.success) {
      setResultado(result.data)
      setMensaje('APROBADO: la cuadrilla cuenta con herramientas suficientes para el despliegue.')
      setEnviando(false)
      return
    }

    if (result.data && typeof result.data === 'object') {
      setResultado(result.data)
      setError('RECHAZADO: existe deficit de herramientas.')
      setEnviando(false)
      return
    }

    setError(result.message || 'No se pudo validar la suficiencia de herramientas.')
    setEnviando(false)
  }

  return (
    <section className="page-card">
      <h1>Calculo de herramientas</h1>
      <p className="subtitle">Valida si la bodega cubre el 100% de la demanda para una cuadrilla y vivienda.</p>

      <div className="form-row split-2">
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
        <div>
          <label htmlFor="codigoVivienda">Codigo de vivienda</label>
          <input
            id="codigoVivienda"
            value={codigoVivienda}
            onChange={(event) => setCodigoVivienda(event.target.value)}
            placeholder="Ej: CONC-001"
          />
        </div>
      </div>

      <h2>Herramientas a asignar</h2>

      {herramientasInput.map((fila, index) => (
        <div key={`herramienta-input-${index}`} className="form-row split-2 calc-tools-row">
          <div>
            <label htmlFor={`herramienta-${index}`}>Herramienta</label>
            <select
              id={`herramienta-${index}`}
              value={fila.id_herramienta}
              onChange={(event) => actualizarFilaHerramienta(index, 'id_herramienta', event.target.value)}
              disabled={cargandoCatalogo}
            >
              <option value="">{cargandoCatalogo ? 'Cargando catalogo...' : 'Selecciona herramienta'}</option>
              {herramientasCatalogo.map((herramienta) => (
                <option key={herramienta.id} value={herramienta.id}>
                  {herramienta.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor={`cantidad-${index}`}>Cantidad asignada</label>
            <input
              id={`cantidad-${index}`}
              type="number"
              min="1"
              value={fila.cantidad_asignada}
              onChange={(event) => actualizarFilaHerramienta(index, 'cantidad_asignada', event.target.value)}
            />
          </div>

          <div className="inline-actions calc-tools-actions">
            <button
              type="button"
              className="btn-danger"
              onClick={() => eliminarFilaHerramienta(index)}
              disabled={herramientasInput.length === 1}
            >
              Quitar
            </button>
          </div>
        </div>
      ))}

      <div className="inline-actions">
        <button type="button" className="btn-outline" onClick={agregarFilaHerramienta}>
          Agregar herramienta
        </button>
        <button type="button" className="btn-primary" onClick={validarStock} disabled={enviando}>
          {enviando ? 'Validando...' : 'Validar stock'}
        </button>
      </div>

      {mensaje && <p className="text-success calc-status approved">{mensaje}</p>}
      {error && <p className="text-error calc-status rejected">{error}</p>}

      {resultado && (
        <article className="detail-panel">
          <h2>Resultado de validacion</h2>
          <p><strong>Estado:</strong> {resultado.puedeAsignarse ? 'APROBADO' : 'RECHAZADO'}</p>
          <p><strong>Cuadrilla:</strong> {resultado.codigoCuadrilla}</p>
          <p><strong>Vivienda:</strong> {resultado.codigoVivienda}</p>
          <p><strong>Voluntarios activos:</strong> {resultado.voluntariosActivos}</p>

          {Array.isArray(herramientasConNombre) && herramientasConNombre.length > 0 && (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Herramienta</th>
                    <th>Asignada</th>
                    <th>Requerida</th>
                    <th>Deficit</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {herramientasConNombre.map((item) => (
                    <tr key={`${item.id_herramienta}-${item.orden_inscripcion || 0}`}>
                      <td>{item.nombre_herramienta}</td>
                      <td>{item.cantidad_asignada}</td>
                      <td>{item.cantidad_requerida}</td>
                      <td>{item.deficit_cobertura}</td>
                      <td>
                        <span className={`result-pill ${item.suficiente ? 'ok' : 'warn'}`}>
                          {item.suficiente ? 'Aprobado' : 'Rechazado'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </article>
      )}
    </section>
  )
}

export default CalculoHerramientas