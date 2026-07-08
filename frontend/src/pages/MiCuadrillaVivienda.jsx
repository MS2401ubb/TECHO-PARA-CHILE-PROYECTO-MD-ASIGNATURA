import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { obtenerMiCuadrillaYVivienda, verificarTokenExistente, crearTokenJornada} from '../services/cuadrilla.service'

function formatDate(value) {
  if (!value) return 'Sin información'
  return new Date(value).toLocaleDateString('es-CL')
}

function MiCuadrillaVivienda() {
  const navigate = useNavigate()
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

  /*useEffect(() => {
    if(user?.rol !== 'Jefe de Cuadrilla') return;

    const result = await crearTokenJornada(codigoCuadrilla)
    if(!result.success){
      setError(result.message || 'No fue posible crear el token')
      return
    }

    const tokenNuevo = result?.data?.tokenNuevo ||

  },[loadingToken]);*/
  const handleCrearToken = async () => {
    if(!data?.codigoCuadrilla) return;

    setLoadingToken(true);
    setError('');

    const result = await crearTokenJornada(data.codigoCuadrilla);
    setLoadingToken(false);

    if(result.success){
      alert(result.message || 'Token generado con exito! Solo para el día de hoy.');
      await cargarToken(data.codigoCuadrilla);
    }else{
      setError(result.message || 'No fue posible crear el token de asignación');
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
            <button type="button" className="btn-outline" onClick={handleCrearToken} disabled={loadingToken}> Creacion de Token Asignación Express</button>
          </div>
        </>
      )}
    </section>
  )
}

export default MiCuadrillaVivienda
