import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { obtenerMiCuadrillaYVivienda } from '../services/cuadrilla.service'

function formatDate(value) {
  if (!value) return 'Sin información'
  return new Date(value).toLocaleDateString('es-CL')
}

function MiCuadrillaVivienda() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      const result = await obtenerMiCuadrillaYVivienda()
      if (!result.success) {
        setError(result.message || 'No fue posible cargar tu cuadrilla y vivienda')
        return
      }
      setData(result.data)
    }
    load()
  }, [])

  const integrantes = data?.integrantes || []
  const vivienda = data?.vivienda || null

  return (
    <section className="page-card">
      <h1>Mi cuadrilla y vivienda</h1>
      <p className="subtitle">Información de tus compañeros, jefe de cuadrilla y vivienda asignada.</p>

      {error && <p className="text-error">{error}</p>}

      {data && (
        <>
          <p><strong>Código de cuadrilla:</strong> {data.codigoCuadrilla}</p>

          <h2>Compañeros y jefe de cuadrilla</h2>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Rol</th>
                </tr>
              </thead>
              <tbody>
                {integrantes.map((persona) => (
                  <tr key={`${persona.rut}-${persona.rol}`}>
                    <td>{persona.nombre}</td>
                    <td>{`${persona.primerApellido || ''} ${persona.segundoApellido || ''}`.trim()}</td>
                    <td>{persona.rol}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2>Datos de la vivienda</h2>
          {vivienda ? (
            <div className="detail-panel">
              <p><strong>Dirección:</strong> {vivienda.direccion}</p>
              <p><strong>Región:</strong> {vivienda.region || 'Sin información'}</p>
              <p><strong>Ciudad:</strong> {vivienda.ciudad || 'Sin información'}</p>
              <p><strong>Fecha de comienzo estimada:</strong> {formatDate(vivienda.fechaInicioEstimada)}</p>
              <p><strong>Fecha de fin estimada:</strong> {formatDate(vivienda.fechaFinEstimada)}</p>
            </div>
          ) : (
            <p className="helper-text">No hay vivienda activa asociada a tu cuadrilla.</p>
          )}
        </>
      )}

      {user?.rol === 'Jefe de Cuadrilla' && (
        <>
          <h2>Opciones de jefatura</h2>
          <div className="inline-actions">
            <button type="button" className="btn-primary" onClick={() => navigate(`/recepcion-inventario?codigoCuadrilla=${data?.codigoCuadrilla || ''}`)}>
              Recepcion de inventario
            </button>
            <button
              type="button"
              className="btn-outline"
              onClick={() => navigate(`/iniciar-cerrar-jornada?codigoCuadrilla=${data?.codigoCuadrilla || ''}`)}
            >
              Iniciar / cerrar jornada
            </button>
            <button
              type="button"
              className="btn-outline"
              onClick={() => navigate('/cerrar-vivienda')}
            >
              Cerrar vivienda
            </button>
          </div>
        </>
      )}
    </section>
  )
}

export default MiCuadrillaVivienda
