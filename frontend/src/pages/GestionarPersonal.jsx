import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { asignarRolUsuario, obtenerUsuarios } from '../services/user.service'

function GestionarPersonal() {
  const { token } = useAuth()
  const [users, setUsers] = useState([])
  const [message, setMessage] = useState('')

  const filtrarAdmin = (listaUsuarios) =>
    (listaUsuarios || []).filter((user) => user.rut !== 'admin' && user.rol !== 'admin')

  useEffect(() => {
    const loadUsers = async () => {
      const result = await obtenerUsuarios()
      if (result.success) setUsers(filtrarAdmin(result.data))
    }

    loadUsers()
  }, [token])

  const onChangeRole = async (rut, rol) => {
    setMessage('')
    const result = await asignarRolUsuario(rut, rol)
    setMessage(result.success ? 'Rol actualizado' : result.message)
    if (result.success) {
      const refreshed = await obtenerUsuarios()
      if (refreshed.success) setUsers(filtrarAdmin(refreshed.data))
    }
  }

  return (
    <section className="page-card">
      <h1>Gestionar Personal</h1>
      <p className="subtitle">Administración de usuarios y roles.</p>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>RUT</th>
              <th>Nombre</th>
              <th>Rol actual</th>
              <th>Cambiar rol</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.rut}>
                <td>{user.rut}</td>
                <td>{user.nombre} {user.primerApellido}</td>
                <td>{user.rol}</td>
                <td>
                  <select defaultValue={user.rol} onChange={(e) => onChangeRole(user.rut, e.target.value)}>
                    <option>Voluntario</option>
                    <option>Jefe de Cuadrilla</option>
                    <option>Encargado de Voluntarios</option>
                    <option>Encargado de Central</option>
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

export default GestionarPersonal
