import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Header({ onOpenMenu }) {
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <header className="app-header">
      <button className="menu-button" onClick={onOpenMenu} type="button">Menu</button>
      <div className="header-user">
        <strong>{user?.nombre || 'Usuario'}</strong>
        <span>{user?.rol}</span>
      </div>
      <button className="btn-outline" onClick={() => navigate('/logout')} type="button">Cerrar sesión</button>
    </header>
  )
}

export default Header
