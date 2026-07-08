import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { obtenerCiudadesPorRegion, obtenerRegiones } from '../services/ubicacion.service'
import {
  descargarDocumentoAlimentacion,
  descargarDocumentoTransporte,
} from '../services/logistica.service'
import { obtenerViviendasPlanificables } from '../services/vivienda.service'

function GestionarViviendas() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [viviendas, setViviendas] = useState([])
  const [message, setMessage] = useState('')
  const [regiones, setRegiones] = useState([])
  const [ciudades, setCiudades] = useState([])
  const [showTransportePanel, setShowTransportePanel] = useState(false)
  const [transporte, setTransporte] = useState({
    origen: '',
    regionCode: '',
    cityCode: '',
  })

  useEffect(() => {
    if (user?.rol !== 'Encargado de Central') return

    const loadData = async () => {
      const [viviendasResult, regionesResult] = await Promise.all([
        obtenerViviendasPlanificables(),
        obtenerRegiones(),
      ])

      if (viviendasResult.success) {
        setViviendas(viviendasResult.data)
      }

      if (regionesResult.success) {
        setRegiones(regionesResult.data)
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

  const irACalculoHerramientas = (vivienda) => {
    const params = new URLSearchParams({
      codigoVivienda: vivienda.codigoVivienda,
      codigoCuadrilla: String(vivienda.cuadrillas?.[0]?.codigoCuadrilla || ''),
    })

    navigate(`/calculo-herramientas?${params.toString()}`)
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

  if (user?.rol !== 'Encargado de Central') {
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
                      onClick={() => irACalculoHerramientas(item)}
                    >
                      Asignación de herramientas
                    </button>
                  </div>
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

export default GestionarViviendas
