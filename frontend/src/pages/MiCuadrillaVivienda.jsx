import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { obtenerMiCuadrillaYVivienda, verificarTokenExistente } from '../services/cuadrilla.service'

function formatDate(value) {
  if (!value) return 'Sin información'
  return new Date(value).toLocaleDateString('es-CL')
}

function MiCuadrillaVivienda() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [tokenDia,setTokenDia] = useState('')
  const [error, setError] = useState('')
  const [loadingToken,setLoadingToken] = useState(false)

  const cargarToken = async (codigoCuadrilla) =>{
    if(user?.rol !== 'Jefe de Cuadrilla') return;

    const result = await verificarTokenExistente(codigoCuadrilla);

    const tokenData = result?.data?.instanceToken || result?.instanceToken;

    if(tokenData?.valorToken){
      setTokenDia(tokenData.valorToken);
    }else{
      setTokenDia('');
    }
  }

  useEffect(() => {
    const load = async () => {
      const result = await obtenerMiCuadrillaYVivienda()
      if (!result.success) {
        setError(result.message || 'No fue posible cargar tu cuadrilla y vivienda')
        return
      }
      setData(result.data)

      if(result.data?.codigoCuadrilla){
        await cargarToken(result.data.codigoCuadrilla);
      }
    }
    load()
  }, [])//REVISAR

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
              {user?.rol === 'Jefe de Cuadrilla' && (
                <p>
                  <strong>Token del Día: </strong> 
                  {/* 💡 Comprobamos si tokenDia tiene un valor real y si no es el string de error 'No existe...' */}
                  {tokenDia ? (
                    <span style={{ fontWeight: 'bold', color: '#2ecc71', backgroundColor: '#e8f8f5', padding: '2px 6px', borderRadius: '4px' }}>
                      {tokenDia}
                    </span>
                  ) : (
                    <span style={{ color: '#e74c3c', fontStyle: 'italic' }}>
                      No se ha generado un token para hoy.
                    </span>
                  )}
                  <span style={{ display: 'block', fontSize: '0.85rem', color: '#7f8c8d', marginTop: '4px' }}>
                    (Se entrega para asignar Voluntarios Espontáneos o de Otras Cuadrillas rápidamente)
                  </span>
                </p>
              )}
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
            <button type="button" className="btn-outline" disabled>Iniciar / cerrar jornada</button>
            <button type="button" className="btn-outline" disabled>Conteo de herramientas</button>
            <button type="button" className="btn-outline" disabled>Validaciones de terreno</button>
          </div>
        </>
      )}
    </section>
  )
}

export default MiCuadrillaVivienda
