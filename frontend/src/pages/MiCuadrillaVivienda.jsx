import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { obtenerCuadrillas } from '../services/cuadrilla.service'
import { obtenerViviendas } from '../services/vivienda.service'

function MiCuadrillaVivienda() {
  const { token, user } = useAuth()
  const [cuadrillas, setCuadrillas] = useState([])
  const [viviendas, setViviendas] = useState([])

  useEffect(() => {
    const load = async () => {
      const [rCuadrillas, rViviendas] = await Promise.all([
        obtenerCuadrillas(token),
        obtenerViviendas(token),
      ])
      if (rCuadrillas.success) setCuadrillas(rCuadrillas.data)
      if (rViviendas.success) setViviendas(rViviendas.data)
    }
    load()
  }, [token])

  return (
    <section className="page-card">
      <h1>Mi cuadrilla y vivienda</h1>
      <p className="subtitle">Vista operativa para {user?.rol}.</p>

      <div className="cards-grid">
        <article className="card compact">
          <h2>Cuadrillas disponibles</h2>
          <p>{cuadrillas.length}</p>
        </article>
        <article className="card compact">
          <h2>Viviendas activas</h2>
          <p>{viviendas.length}</p>
        </article>
      </div>

      {user?.rol === 'Jefe de Cuadrilla' && (
        <div className="inline-actions">
          <button type="button" className="btn-outline" disabled>Confirmar recepción (en ruta herramientas)</button>
          <button type="button" className="btn-outline" disabled>Finalizar jornada (en ruta herramientas)</button>
        </div>
      )}

      <p className="helper-text">El detalle específico de jornada se mantiene en el módulo de herramientas, según tu decisión.</p>
    </section>
  )
}

export default MiCuadrillaVivienda
