import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { obtenerCiudadesPorRegion, obtenerRegiones } from '../services/ubicacion.service'
import {
  descargarDocumentoAlimentacion,
  descargarDocumentoTransporte,
  obtenerCatalogoHerramientas,
  validarSuficienciaHerramientas,
} from '../services/logistica.service'
import { editarVivienda, obtenerViviendasPlanificables } from '../services/vivienda.service'

function GestionarViviendas() {
  const { user } = useAuth()
  const [   viviendas, setViviendas] = useState([])
  const [message, setMessage] = useState('')
  const [regiones, setRegiones] = useState([])
  const [ciudades, setCiudades] = useState([])
  const [showTransportePanel, setShowTransportePanel] = useState(false)
  const [transporte, setTransporte] = useState({
    origen: '',
    regionCode: '',
    cityCode: '',
  })
  const [viviendaSeleccionada, setViviendaSeleccionada] = useState(null)
  const [herramientasCatalogo, setHerramientasCatalogo] = useState([])
  const [cuadrillaSeleccionada, setCuadrillaSeleccionada] = useState('')
  const [herramientasInput, setHerramientasInput] = useState([{ id_herramienta: '', cantidad_asignada: 1 }])
  const [actualizandoVivienda, setActualizandoVivienda] = useState('')

  useEffect(() => {
    if (user?.rol !== 'Encargado de Central') return

    const loadData = async () => {
      const [viviendasResult, regionesResult, herramientasResult] = await Promise.all([
        obtenerViviendasPlanificables(),
        obtenerRegiones(),
        obtenerCatalogoHerramientas(),
      ])

      if (viviendasResult.success) {
        setViviendas(viviendasResult.data)
      }

      if (regionesResult.success) {
        setRegiones(regionesResult.data)
      }

      if (herramientasResult.success) {
        setHerramientasCatalogo(herramientasResult.data)
      }
    }

    loadData()
  }, [user?.rol])

  const handleRegionChange = async (regionCode) => {
    setTransporte((current) => ({
      ...current,
      regionCode,
      cityCode: '',
    }))

    if (!regionCode) {
      setCiudades([])
      return
    }

    const result = await obtenerCiudadesPorRegion(regionCode)
    if (result.success) {
      setCiudades(result.data)
    }
  }

  const abrirPanelHerramientas = (vivienda) => {
    setViviendaSeleccionada(vivienda)
    setCuadrillaSeleccionada(String(vivienda.cuadrillas[0]?.codigoCuadrilla || ''))
    setHerramientasInput([{ id_herramienta: '', cantidad_asignada: 1 }])
    setMessage('')
  }

  const agregarFilaHerramienta = () => {
    setHerramientasInput((current) => [...current, { id_herramienta: '', cantidad_asignada: 1 }])
  }

  const actualizarFilaHerramienta = (index, field, value) => {
    setHerramientasInput((current) =>
      current.map((item, idx) => (idx === index ? { ...item, [field]: value } : item))
    )
  }

  const descargarAlimentacion = async (codigoVivienda) => {
    const result = await descargarDocumentoAlimentacion({
      codigoVivienda,
      rutEncargado: user?.rut,
    })

    if (!result.success) {
      window.alert(result.message || 'No fue posible descargar el documento de alimentación.')
      return
    }

    window.alert('Documento de alimentación descargado correctamente.')
  }

  const validarHerramientas = async () => {
    if (!viviendaSeleccionada) return
    if (!cuadrillaSeleccionada) {
      window.alert('Debes seleccionar una cuadrilla.')
      return
    }

    const herramientasLimpias = herramientasInput
      .filter((item) => item.id_herramienta)
      .map((item) => ({
        id_herramienta: Number(item.id_herramienta),
        cantidad_asignada: Number(item.cantidad_asignada),
      }))

    if (herramientasLimpias.length === 0) {
      window.alert('Debes ingresar al menos una herramienta.')
      return
    }

    const result = await validarSuficienciaHerramientas({
      codigo_cuadrilla: Number(cuadrillaSeleccionada),
      codigo_vivienda: viviendaSeleccionada.codigoVivienda,
      herramientas: herramientasLimpias,
    })

    if (result.success) {
      window.alert('Hay suficientes herramientas para la cuadrilla seleccionada.')
      return
    }

    window.alert(result.message || 'No hay suficientes herramientas para la cuadrilla seleccionada.')
  }

  const descargarTransporte = async () => {
    if (!transporte.origen.trim() || !transporte.cityCode) {
      window.alert('Debes completar punto de origen y ciudad destino.')
      return
    }

    const result = await descargarDocumentoTransporte({
      codigoCiudad: Number(transporte.cityCode),
      trasladoPuntoOrigen: transporte.origen.trim(),
    })

    if (!result.success) {
      window.alert(result.message || 'No fue posible descargar el manifiesto de carga.')
      return
    }

    window.alert('Manifiesto de carga descargado correctamente.')
  }

  const pasarAConstruccion = async (codigoVivienda) => {
    setActualizandoVivienda(codigoVivienda)
    setMessage('')

    const result = await editarVivienda(codigoVivienda, { estado: 'Construyendo' })
    if (!result.success) {
      setActualizandoVivienda('')
      window.alert(result.message || 'No fue posible actualizar la vivienda.')
      return
    }

    setViviendas((current) => current.filter((vivienda) => vivienda.codigoVivienda !== codigoVivienda))
    setViviendaSeleccionada((current) => (current?.codigoVivienda === codigoVivienda ? null : current))
    setMessage(`La vivienda ${codigoVivienda} se movió a estado Construyendo.`)
    setActualizandoVivienda('')
  }

  if (user?.rol !== 'Encargado de Central' && user?.rol !== 'admin') {
    return (
      <section className="page-card">
        <h1>Gestionar Viviendas</h1>
        <p className="subtitle">No tienes permisos para ver Planificar Viviendas.</p>
      </section>
    )
  }

  return (
    <section className="page-card">
      <h1>Gestionar Viviendas</h1>
      <p className="subtitle">Planificación logística para viviendas en estado Planificación.</p>

      <div className="inline-actions">
        <button type="button" className="btn-primary" onClick={() => setShowTransportePanel((prev) => !prev)}>
          Planificar transporte por ciudad
        </button>
      </div>

      {showTransportePanel && (
        <article className="detail-panel">
          <h2>Planificar transporte por ciudad</h2>
          <div className="form-row">
            <label htmlFor="origenSugerido">Punto de origen sugerido</label>
            <input
              id="origenSugerido"
              value={transporte.origen}
              onChange={(event) => setTransporte((current) => ({ ...current, origen: event.target.value }))}
              placeholder="Ej: Bodega Central Concepción"
            />
          </div>
          <div className="form-row split-2">
            <div>
              <label htmlFor="regionCode">Región</label>
              <select
                id="regionCode"
                value={transporte.regionCode}
                onChange={(event) => handleRegionChange(event.target.value)}
              >
                <option value="">Selecciona una región</option>
                {regiones.map((region) => (
                  <option key={region.codigo} value={region.codigo}>{region.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="cityCode">Ciudad</label>
              <select
                id="cityCode"
                value={transporte.cityCode}
                onChange={(event) => setTransporte((current) => ({ ...current, cityCode: event.target.value }))}
                disabled={!transporte.regionCode}
              >
                <option value="">{transporte.regionCode ? 'Selecciona una ciudad' : 'Selecciona primero una región'}</option>
                {ciudades.map((city) => (
                  <option key={city.codigo} value={city.codigo}>{city.nombre}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn-outline" onClick={descargarTransporte}>
              Descargar Manifiesto de Carga
            </button>
          </div>
        </article>
      )}

      <h2>Planificar Viviendas</h2>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Código vivienda</th>
              <th>Dirección</th>
              <th>Región</th>
              <th>Ciudad</th>
              <th>Personas asignadas</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {viviendas.map((item) => (
              <tr key={item.codigoVivienda}>
                <td>{item.codigoVivienda}</td>
                <td>{item.direccion}</td>
                <td>{item.region || 'Sin región'}</td>
                <td>{item.ciudad || 'Sin ciudad'}</td>
                <td>
                  {(item.personasAsignadas || []).map((persona) => `${persona.nombre} ${persona.primerApellido} ${persona.segundoApellido || ''}`.trim()).join(', ')}
                </td>
                <td>
                  <div className="inline-actions">
                    <button
                      type="button"
                      className="btn-outline"
                      onClick={() => descargarAlimentacion(item.codigoVivienda)}
                    >
                      Documento Alimentación
                    </button>
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={() => abrirPanelHerramientas(item)}
                    >
                      Asignación de herramientas
                    </button>
                    <button
                      type="button"
                      className="btn-success"
                      onClick={() => pasarAConstruccion(item.codigoVivienda)}
                      disabled={actualizandoVivienda === item.codigoVivienda}
                    >
                      {actualizandoVivienda === item.codigoVivienda ? 'Actualizando...' : 'Pasar a Construcción'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {viviendaSeleccionada && (
        <article className="detail-panel">
          <h2>Asignación de herramientas - {viviendaSeleccionada.codigoVivienda}</h2>
          <div className="form-row">
            <label htmlFor="codigoCuadrilla">Cuadrilla</label>
            <select
              id="codigoCuadrilla"
              value={cuadrillaSeleccionada}
              onChange={(event) => setCuadrillaSeleccionada(event.target.value)}
            >
              {viviendaSeleccionada.cuadrillas.map((cuadrilla) => (
                <option key={cuadrilla.codigoCuadrilla} value={cuadrilla.codigoCuadrilla}>
                  Cuadrilla {cuadrilla.codigoCuadrilla}
                </option>
              ))}
            </select>
          </div>

          {herramientasInput.map((fila, index) => (
            <div key={`herramienta-${index}`} className="form-row split-2">
              <div>
                <label htmlFor={`herramienta-${index}`}>Herramienta</label>
                <select
                  id={`herramienta-${index}`}
                  value={fila.id_herramienta}
                  onChange={(event) => actualizarFilaHerramienta(index, 'id_herramienta', event.target.value)}
                >
                  <option value="">Selecciona una herramienta</option>
                  {herramientasCatalogo.map((herramienta) => (
                    <option key={herramienta.id} value={herramienta.id}>{herramienta.nombre}</option>
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
            </div>
          ))}

          <div className="inline-actions">
            <button type="button" className="btn-outline" onClick={agregarFilaHerramienta}>Agregar herramienta</button>
            <button type="button" className="btn-primary" onClick={validarHerramientas}>Validar asignación</button>
            <button type="button" className="btn-danger" onClick={() => setViviendaSeleccionada(null)}>Cerrar panel</button>
          </div>
        </article>
      )}

      {message && <p className="helper-text">{message}</p>}
    </section>
  )
}

export default GestionarViviendas
