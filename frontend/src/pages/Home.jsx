import { useState } from 'react'
import UserList from '../components/UserList.jsx'
import Login from './Login.jsx'
import techoLogo from '../assets/LOGO-TECHO-COLOR.png'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.hostname}:3000` : 'http://localhost:3000')

function App() {
  const [showLogin, setShowLogin] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [users, setUsers] = useState([])
  const [showUserList, setShowUserList] = useState(false)
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [usersError, setUsersError] = useState('')

  const handleLoadUsers = async () => {
    if (showUserList) {
      setUsers([])
      setShowUserList(false)
      setUsersError('')
      return
    }

    setLoadingUsers(true)
    setUsersError('')
    setShowUserList(true)

    try {
      const response = await fetch(`${API_BASE_URL}/api/usuario`)
      if (!response.ok) {
        throw new Error(`Error ${response.status}`)
      }

      const payload = await response.json()
      const userList = Array.isArray(payload?.data) ? payload.data : []
      setUsers(userList)
    } catch (error) {
      console.error(error)
      setUsers([])
      setUsersError('No se pudo cargar la lista de usuarios. Verifica que el backend esté en ejecución.')
    } finally {
      setLoadingUsers(false)
    }
  }

  return (
    <div className="app-shell">
      <header className="hero-card">
        <div>
        
          <img src={techoLogo} alt="Logo de Techo para Chile" style={{ width: '10rem', height: 'auto' }} />
          <div style={{ marginTop: '18px' }}>
            {!currentUser ? (
              <button type="button" className="btn-primary" onClick={()=>setShowLogin(true)}>Iniciar sesión</button>
            ) : (
              <div>Bienvenido, {currentUser.nombre || currentUser.email}</div>
            )}
          </div>
          <p className="hero-text">
            Una interfaz simple para visualizar usuarios, herramientas y jornadas de ayuda.
          </p>
        </div>
      </header>

      <main>
        {!currentUser ? (
          <section className="login-prompt-card">
            
          </section>
        ) : (
          <>
            <section className="cards-grid">
              <article className="card">
                <h2>Usuarios</h2>
                <p>Administra voluntarios, encargados y beneficiarios.</p>
                <button type="button" onClick={handleLoadUsers}>
                  {showUserList ? 'Ocultar usuarios' : 'Ver usuarios'}
                </button>
              </article>
              <article className="card">
                <h2>Herramientas</h2>
                <p>Controla la entrega de herramientas y stock disponible.</p>
                <button type="button">Ver herramientas</button>
              </article>
              <article className="card">
                <h2>Jornadas</h2>
                <p>Revisa las actividades, viviendas y cuadrillas planificadas.</p>
                <button type="button">Ver jornadas</button>
              </article>
            </section>

            {showUserList && <UserList users={users} loading={loadingUsers} error={usersError} />}
          </>
        )}

        {showLogin && (
          <Login onSuccess={(user)=>setCurrentUser(user)} onClose={()=>setShowLogin(false)} />
        )}

        <section className="info-panel">
          <h2>Resumen rápido</h2>
          <p>
            Esta interfaz básica sirve como punto de partida para conectar la parte
            frontend con los datos del backend y mostrar la información principal
            del proyecto.
          </p>
        </section>
      </main>
    </div>
  )
}

export default App
