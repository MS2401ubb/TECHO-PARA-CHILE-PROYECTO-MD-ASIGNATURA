import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ROLES_VOLUNTARIOS } from '../constants/roles'

const menuItems = [
  { label: 'Home', to: '/home', roles: [...ROLES_VOLUNTARIOS, 'Jefe de Cuadrilla', 'Encargado de Voluntarios', 'Encargado de Central', 'admin'] },
  { label: 'Mi cuadrilla y vivienda', to: '/mi-cuadrilla-vivienda', roles: [...ROLES_VOLUNTARIOS, 'Jefe de Cuadrilla'] },
  { label: 'Enviar reporte', to: '/enviar-reporte', roles: ['Jefe de Cuadrilla', 'Encargado de Voluntarios'] },
  { label: 'Postulantes', to: '/postulantes', roles: ['Encargado de Voluntarios'] },
  { label: 'Gestionar Voluntarios', to: '/gestionar-voluntarios', roles: ['Encargado de Voluntarios', 'Encargado de Central', 'admin'] },
  { label: 'Dashboard', to: '/dashboard', roles: ['Encargado de Central', 'admin'] },
  { label: 'Gestionar Personal', to: '/gestionar-personal', roles: ['Encargado de Central', 'admin'] },
  { label: 'Gestionar Viviendas', to: '/gestionar-viviendas', roles: ['Encargado de Central', 'admin'] },
  { label: 'Ver reportes', to: '/reportes', roles: ['Encargado de Central', 'admin'] },
  { label: 'Logística transporte', to: '/logistica-transporte', roles: ['Encargado de Central', 'admin'] },
  { label: 'Logística alimentación', to: '/logistica-alimentacion', roles: ['Encargado de Central', 'admin'] },
  { label: 'Mi perfil', to: '/mi-perfil', roles: [...ROLES_VOLUNTARIOS, 'Jefe de Cuadrilla', 'Encargado de Voluntarios', 'Encargado de Central', 'admin'] },
]

function Sidebar({ open, onClose }) {
  const { user } = useAuth()
  const isVoluntario = ROLES_VOLUNTARIOS.includes(user?.rol)
  //const isVoluntarioRestringido = user?.rol === 'Voluntario' && user?.estadoVoluntario !== 'Activo'
  const isVoluntarioRestringido = isVoluntario && user?.estadoVoluntario !=='Activo'
  const restrictedAllowed = ['/home', '/mi-perfil']

  return (
    <aside className={`app-sidebar ${open ? 'open' : ''}`}>
      <div className="sidebar-head">
        <h2>TECHO</h2>
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
