import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import techoLogo from '../assets/LOGO-TECHO-COLOR.png'

const menuItems = [
  { label: 'Home', to: '/home', roles: ['Voluntario', 'Jefe de Cuadrilla', 'Encargado de Voluntarios', 'Encargado de Central', 'admin'] },
  { label: 'Dashboard', to: '/dashboard', roles: ['Encargado de Central', 'admin'] },
  { label: 'Mi cuadrilla y vivienda', to: '/mi-cuadrilla-vivienda', roles: ['Voluntario', 'Jefe de Cuadrilla'] },
  { label: 'Postulantes', to: '/postulantes', roles: ['Encargado de Voluntarios'] },
  { label: 'Gestionar Distribucion Laboral', to: '/gestionar-voluntarios', roles: ['Encargado de Voluntarios', 'Encargado de Central', 'admin'] },
  { label: 'Gestionar Personal', to: '/gestionar-personal', roles: ['Encargado de Central', 'admin'] },
  { label: 'Gestionar Viviendas', to: '/gestionar-viviendas', roles: ['Encargado de Central', 'admin'] },
  { label: 'Enviar reporte', to: '/enviar-reporte', roles: ['Jefe de Cuadrilla', 'Encargado de Voluntarios'] },
  { label: 'Ver reportes', to: '/reportes', roles: ['Encargado de Central', 'admin'] },
  { label: 'Mi perfil', to: '/mi-perfil', roles: ['Voluntario', 'Jefe de Cuadrilla', 'Encargado de Voluntarios', 'Encargado de Central', 'admin'] },
]

function Sidebar({ open, onClose }) {
  const { user } = useAuth()
  const isVoluntarioRestringido = user?.rol === 'Voluntario' && user?.estadoVoluntario !== 'Activo'
  const restrictedAllowed = ['/home', '/mi-perfil']

  return (
    <aside className={`app-sidebar ${open ? 'open' : ''}`}>
      <div className="sidebar-head">
        <img src={techoLogo} alt="Logo TECHO" style={{ width: '10rem', height: 'auto' }}></img>
        <button type="button" className="close-sidebar" onClick={onClose}>X</button>
      </div>
      <nav className="sidebar-nav">
        {menuItems
          .filter((item) => item.roles.includes(user?.rol))
          .filter((item) => !isVoluntarioRestringido || restrictedAllowed.includes(item.to))
          .map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}
              onClick={onClose}
            >
              {item.label}
            </NavLink>
          ))}
      </nav>
    </aside>
  )
}

export default Sidebar
