function UserList({ users, loading, error }) {
  return (
    <section className="users-section">
      <div className="users-header">
        <div>
          <h2>Lista de usuarios</h2>
        </div>
      </div>

      {error && <p className="text-error">{error}</p>}
      {loading && <p>Cargando usuarios...</p>}

      {!loading && !error && users.length === 0 && (
        <p>No hay usuarios cargados. Haz clic en el botón azul de arriba para obtener los usuarios.</p>
      )}

      {users.length > 0 && (
        <div className="users-table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>RUT</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Teléfono</th>
                <th>Rol</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.rutUsuario || user.rut}>
                  <td>{user.rutUsuario || user.rut}</td>
                  <td>{`${user.nombre || ''} ${user.primerApellido || ''} ${user.segundoApellido || ''}`.trim()}</td>
                  <td>{user.email || '-'}</td>
                  <td>{user.telefono || '-'}</td>
                  <td>{user.rol || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default UserList
