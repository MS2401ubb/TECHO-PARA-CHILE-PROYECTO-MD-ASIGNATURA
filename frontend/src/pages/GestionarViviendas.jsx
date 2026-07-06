import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { editarVivienda, obtenerViviendas } from '../services/vivienda.service'

function GestionarViviendas() {
  const { token } = useAuth()
  const [viviendas, setViviendas] = useState([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    const loadViviendas = async () => {
      const result = await obtenerViviendas()
      if (result.success) setViviendas(result.data)
    }

    loadViviendas()
  }, [token])

  const actualizarEstado = async (codigo, estado) => {
    const result = await editarVivienda(codigo, { estado })
    setMessage(result.success ? 'Vivienda actualizada' : result.message)
    if (result.success) {
      const refreshed = await obtenerViviendas()
      if (refreshed.success) setViviendas(refreshed.data)
    }
  }

  return (
    <section className="page-card">
      <h1>Gestionar Viviendas</h1>
      <p className="subtitle">Control de estado para despliegue logístico.</p>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Dirección</th>
              <th>Estado</th>
              <th>Actualizar</th>
            </tr>
          </thead>
          <tbody>
            {viviendas.map((item) => (
              <tr key={item.codigo}>
                <td>{item.codigo}</td>
                <td>{item.direccion}</td>
                <td>{item.estado}</td>
                <td>
                  <select defaultValue={item.estado} onChange={(e) => actualizarEstado(item.codigo, e.target.value)}>
                    <option>Planificacion</option>
                    <option>Distribuyendo Fuerza Laboral</option>
                    <option>En Ejecucion</option>
                    <option>Bloqueada</option>
                    <option>Finalizada</option>
                  </select>
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
