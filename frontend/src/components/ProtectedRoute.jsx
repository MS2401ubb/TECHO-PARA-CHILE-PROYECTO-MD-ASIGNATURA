import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ allowedRoles, children }) {
  const { user, loading, isAuthenticated } = useAuth()
  const location = useLocation()

  if (loading) return <p className="center-message">Cargando sesión...</p>

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (allowedRoles && !allowedRoles.includes(user?.rol)) {
    return <Navigate to="/home" replace />
  }

  const isVoluntarioRestringido = user?.rol === 'Voluntario' && user?.estadoVoluntario !== 'Activo'
  const allowedRestrictedPaths = ['/home', '/mi-perfil', '/logout']
  if (isVoluntarioRestringido && !allowedRestrictedPaths.includes(location.pathname)) {
    return <Navigate to="/home" replace />
  }

  if (children) return children
  return <Outlet />
}

export default ProtectedRoute
