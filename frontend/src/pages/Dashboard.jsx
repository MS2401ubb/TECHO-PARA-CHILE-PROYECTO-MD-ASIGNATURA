import { useEffect, useMemo, useState } from 'react'
import { obtenerViviendas } from '../services/vivienda.service'
import { useAuth } from '../context/AuthContext'

function Dashboard() {
  const { token } = useAuth()
  const [loading, setLoading] = useState(false)
  const [viviendas, setViviendas] = useState([])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const result = await obtenerViviendas(token)
      if (result.success) setViviendas(result.data)
      setLoading(false)
    }
    load()
  }, [token])

  const resumen = useMemo(() => {
    return viviendas.reduce((acc, vivienda) => {
      const ciudad = vivienda?.ciudad?.nombre || `Ciudad ${vivienda?.codigoCiudad || 'N/A'}`
      acc[ciudad] = (acc[ciudad] || 0) + 1
      return acc
    }, {})
  }, [viviendas])

  return (
    <section className="page-card">
      <h1>Dashboard Nacional</h1>
      <p className="subtitle">Viviendas activas por ciudad y estado de avance.</p>

      {loading && <p>Cargando viviendas...</p>}

      {!loading && (
        <>
          <div className="cards-grid">
            {Object.keys(resumen).length === 0 && <p>No hay datos de viviendas disponibles.</p>}
            {Object.entries(resumen).map(([ciudad, total]) => (
              <article key={ciudad} className="card compact">
                <h2>{ciudad}</h2>
                <p>{total} viviendas registradas</p>
              </article>
            ))}
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Dirección</th>
                  <th>Estado</th>
                  <th>Avance</th>
                </tr>
              </thead>
              <tbody>
                {viviendas.map((vivienda) => (
                  <tr key={vivienda.codigo}>
                    <td>{vivienda.codigo}</td>
                    <td>{vivienda.direccion}</td>
                    <td>{vivienda.estado}</td>
                    <td>{vivienda.porcentajeAvance ?? 0}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  )
}

export default Dashboard
