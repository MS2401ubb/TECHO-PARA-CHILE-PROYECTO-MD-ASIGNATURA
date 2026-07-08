import { useEffect, useMemo, useState } from 'react'
import { obtenerDashboardCentral } from '../services/vivienda.service'

function Dashboard() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [dashboard, setDashboard] = useState(null)
  const [codigoViviendaSeleccionada, setCodigoViviendaSeleccionada] = useState('')
  const [codigoCuadrillaSeleccionada, setCodigoCuadrillaSeleccionada] = useState('')
  const [regionSeleccionada, setRegionSeleccionada] = useState('')
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError('')

      const result = await obtenerDashboardCentral()
      if (!result.success) {
        setError(result.message || 'No fue posible cargar el dashboard central.')
        setDashboard(null)
        setLoading(false)
        return
      }

      setDashboard(result.data)

      const primeraVivienda = result.data?.viviendas?.[0]
      if (primeraVivienda) {
        setCodigoViviendaSeleccionada(primeraVivienda.codigo)
        setCodigoCuadrillaSeleccionada(String(primeraVivienda.cuadrillas?.[0]?.codigoCuadrilla || ''))
      } else {
        setCodigoViviendaSeleccionada('')
        setCodigoCuadrillaSeleccionada('')
      }

      setLoading(false)
    }

    load()
  }, [])

  const viviendas = useMemo(() => dashboard?.viviendas || [], [dashboard])
  const resumenCiudades = useMemo(() => dashboard?.viviendasActivasPorCiudad || [], [dashboard])
  const maxCiudad = Math.max(...resumenCiudades.map((item) => item.total), 1)

  const regionesActivas = useMemo(() => {
    const regiones = new Set(
      viviendas
        .map((vivienda) => vivienda.region)
        .filter((region) => Boolean(region))
    )
    return Array.from(regiones).sort((a, b) => a.localeCompare(b, 'es'))
  }, [viviendas])

  const ciudadesActivasPorRegion = useMemo(() => {
    const ciudades = new Set(
      viviendas
        .filter((vivienda) => vivienda.region === regionSeleccionada)
        .map((vivienda) => vivienda.ciudad)
        .filter((ciudad) => Boolean(ciudad))
    )
    return Array.from(ciudades).sort((a, b) => a.localeCompare(b, 'es'))
  }, [regionSeleccionada, viviendas])

  const viviendasFiltradas = useMemo(() => {
    if (!ciudadSeleccionada) return viviendas
    return viviendas.filter((vivienda) => vivienda.ciudad === ciudadSeleccionada)
  }, [ciudadSeleccionada, viviendas])

  const viviendaSeleccionada = useMemo(() => {
    if (!codigoViviendaSeleccionada) return null
    return viviendasFiltradas.find((vivienda) => vivienda.codigo === codigoViviendaSeleccionada) || null
  }, [codigoViviendaSeleccionada, viviendasFiltradas])

  const cuadrillaSeleccionada = useMemo(() => {
    if (!viviendaSeleccionada || !codigoCuadrillaSeleccionada) return null
    return (
      viviendaSeleccionada.cuadrillas.find(
        (cuadrilla) => String(cuadrilla.codigoCuadrilla) === String(codigoCuadrillaSeleccionada)
      ) || null
    )
  }, [codigoCuadrillaSeleccionada, viviendaSeleccionada])

  const seleccionarVivienda = (codigoVivienda) => {
    const siguienteVivienda = viviendasFiltradas.find((item) => item.codigo === codigoVivienda)
    setCodigoViviendaSeleccionada(codigoVivienda)
    setCodigoCuadrillaSeleccionada(String(siguienteVivienda?.cuadrillas?.[0]?.codigoCuadrilla || ''))
  }

  const handleRegionChange = (region) => {
    setRegionSeleccionada(region)
    setCiudadSeleccionada('')

    const viviendasRegion = region
      ? viviendas.filter((vivienda) => vivienda.region === region)
      : viviendas

    const primeraVivienda = viviendasRegion[0]
    setCodigoViviendaSeleccionada(primeraVivienda?.codigo || '')
    setCodigoCuadrillaSeleccionada(String(primeraVivienda?.cuadrillas?.[0]?.codigoCuadrilla || ''))
  }

  const handleCiudadChange = (ciudad) => {
    setCiudadSeleccionada(ciudad)

    const viviendasCiudad = ciudad
      ? viviendas.filter((vivienda) => vivienda.ciudad === ciudad)
      : viviendas.filter((vivienda) => vivienda.region === regionSeleccionada)

    const primeraVivienda = viviendasCiudad[0]
    setCodigoViviendaSeleccionada(primeraVivienda?.codigo || '')
    setCodigoCuadrillaSeleccionada(String(primeraVivienda?.cuadrillas?.[0]?.codigoCuadrilla || ''))
  }

  return (
    <section className="page-card">
      <h1>Dashboard Nacional</h1>
      <p className="subtitle">Viviendas activas en estado Construyendo por ciudad, avance y detalle operativo.</p>

      {error && <p className="text-error">{error}</p>}

      {loading && <p>Cargando viviendas...</p>}

      {!loading && dashboard && (
        <>
          <div className="dashboard-top-grid">
            <article className="card compact">
              <h2>Total viviendas activas</h2>
              <p>{dashboard.totalViviendasActivas}</p>
            </article>

            <div className="detail-panel dashboard-city-summary">
              <h2>Viviendas activas por ciudad</h2>
              {resumenCiudades.length === 0 && <p>No hay viviendas en estado Construyendo.</p>}
              {resumenCiudades.length > 0 && (
                <div className="city-bars">
                  {resumenCiudades.map((item) => (
                    <div key={item.ciudad} className="city-bar-row">
                      <span className="city-label">{item.ciudad}</span>
                      <div className="city-bar-track">
                        <div
                          className="city-bar-fill"
                          style={{ width: `${Math.max((item.total / maxCiudad) * 100, 10)}%` }}
                        >
                          {item.total}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="detail-panel">
            <h2>Listado de viviendas activas</h2>
            <div className="form-row split-2">
              <div>
                <label htmlFor="filtroRegion">Filtrar por región</label>
                <select
                  id="filtroRegion"
                  value={regionSeleccionada}
                  onChange={(event) => handleRegionChange(event.target.value)}
                >
                  <option value="">Todas las regiones</option>
                  {regionesActivas.map((region) => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="filtroCiudad">Filtrar por ciudad</label>
                <select
                  id="filtroCiudad"
                  value={ciudadSeleccionada}
                  onChange={(event) => handleCiudadChange(event.target.value)}
                  disabled={!regionSeleccionada}
                >
                  <option value="">{regionSeleccionada ? 'Todas las ciudades de la región' : 'Selecciona primero una región'}</option>
                  {ciudadesActivasPorRegion.map((ciudad) => (
                    <option key={ciudad} value={ciudad}>{ciudad}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Ciudad</th>
                  <th>Dirección</th>
                  <th>Estado</th>
                  <th>Avance</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {viviendasFiltradas.map((vivienda) => (
                  <tr key={vivienda.codigo}>
                    <td>{vivienda.codigo}</td>
                    <td>{vivienda.ciudad || 'Sin ciudad'}</td>
                    <td>{vivienda.direccion}</td>
                    <td>{vivienda.estado}</td>
                    <td>{vivienda.porcentajeAvance ?? 0}%</td>
                    <td>
                      <button
                        type="button"
                        className="btn-outline"
                        onClick={() => seleccionarVivienda(vivienda.codigo)}
                      >
                        Ver detalle
                      </button>
                    </td>
                  </tr>
                ))}
                {viviendasFiltradas.length === 0 && (
                  <tr>
                    <td colSpan={6}>No hay viviendas activas para la ciudad seleccionada.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {viviendaSeleccionada && (
            <article className="detail-panel dashboard-detail">
              <h2>Detalle de vivienda {viviendaSeleccionada.codigo}</h2>
              <p>
                <strong>Dirección:</strong> {viviendaSeleccionada.direccion}
              </p>
              <p>
                <strong>Ubicación:</strong> {viviendaSeleccionada.ciudad || 'Sin ciudad'} - {viviendaSeleccionada.region || 'Sin región'}
              </p>
              <p>
                <strong>Avance:</strong> {viviendaSeleccionada.porcentajeAvance ?? 0}%
              </p>

              <div className="form-row">
                <label htmlFor="dashboard-cuadrilla-select">Cuadrilla activa de la vivienda</label>
                <select
                  id="dashboard-cuadrilla-select"
                  value={codigoCuadrillaSeleccionada}
                  onChange={(event) => setCodigoCuadrillaSeleccionada(event.target.value)}
                  disabled={viviendaSeleccionada.cuadrillas.length === 0}
                >
                  {viviendaSeleccionada.cuadrillas.length === 0 && <option value="">Sin cuadrillas activas</option>}
                  {viviendaSeleccionada.cuadrillas.map((cuadrilla) => (
                    <option key={cuadrilla.codigoCuadrilla} value={cuadrilla.codigoCuadrilla}>
                      Cuadrilla {cuadrilla.codigoCuadrilla}
                    </option>
                  ))}
                </select>
              </div>

              {cuadrillaSeleccionada && (
                <>
                  <p>
                    <strong>Descripción cuadrilla:</strong> {cuadrillaSeleccionada.descripcion || 'Sin descripción'}
                  </p>
                  <p>
                    <strong>Inicio asignación:</strong> {new Date(cuadrillaSeleccionada.fechaInicioAsignacion).toLocaleDateString('es-CL')}
                  </p>

                  <h3>Herramientas de la cuadrilla en esta vivienda</h3>
                  <div className="table-wrapper">
                    <table>
                      <thead>
                        <tr>
                          <th>Herramienta</th>
                          <th>Cantidad inicial</th>
                          <th>Cantidad final</th>
                          <th>Estado cierre</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cuadrillaSeleccionada.herramientas.length === 0 && (
                          <tr>
                            <td colSpan={4}>No hay registros de herramientas para esta cuadrilla en la vivienda seleccionada.</td>
                          </tr>
                        )}
                        {cuadrillaSeleccionada.herramientas.map((herramienta) => (
                          <tr key={herramienta.idHerramienta}>
                            <td>{herramienta.nombre}</td>
                            <td>{herramienta.cantidadInicial}</td>
                            <td>{herramienta.cantidadFisicaFinal}</td>
                            <td>{herramienta.estadoCierre}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </article>
          )}
        </>
      )}
    </section>
  )
}

export default Dashboard
