import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const roleCards = {
  Voluntario: [
    { title: 'Mi cuadrilla y vivienda', text: 'Consulta participantes y datos de la vivienda activa.', to: '/mi-cuadrilla-vivienda' },
  ],
  'Jefe de Cuadrilla': [
    { title: 'Mi cuadrilla y vivienda', text: 'Visualiza dotación, herramientas y estado de jornada.', to: '/mi-cuadrilla-vivienda' },
    { title: 'Enviar reporte', text: 'Registra incidencias al cierre de jornada.', to: '/enviar-reporte' },
  ],
  'Encargado de Voluntarios': [
    { title: 'Postulantes', text: 'Revisa y valida postulaciones en orden de llegada.', to: '/postulantes' },
    { title: 'Gestionar Voluntarios', text: 'Asigna voluntarios y jefes a cuadrillas.', to: '/gestionar-voluntarios' },
    { title: 'Enviar reporte', text: 'Comunica incidentes o estado operativo a Central.', to: '/enviar-reporte' },
  ],
  'Encargado de Central': [
    { title: 'Dashboard', text: 'Tablero nacional de viviendas activas y avance.', to: '/dashboard' },
    { title: 'Gestionar Voluntarios', text: 'Distribuye voluntarios y cuadrillas por vivienda.', to: '/gestionar-voluntarios' },
    { title: 'Gestionar Personal', text: 'Administra usuarios y roles.', to: '/gestionar-personal' },
    { title: 'Gestionar Viviendas', text: 'Configura despliegues y estado logístico.', to: '/gestionar-viviendas' },
    { title: 'Ver reportes', text: 'Monitorea reportes y su estado de atención.', to: '/reportes' },
  ],
  admin: [
    { title: 'Dashboard', text: 'Acceso completo a panel de Central.', to: '/dashboard' },
    { title: 'Gestionar Personal', text: 'Administra usuarios y permisos del sistema.', to: '/gestionar-personal' },
  ],
}

function Home() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const cards = useMemo(() => roleCards[user?.rol] || [], [user?.rol])

  return (
    <section className="page-card">
      <h1>Home</h1>
      <p className="subtitle">Panel de inicio por rol. Bienvenido, {user?.nombre}.</p>

      <div className="cards-grid">
        {cards.map((card) => (
          <article key={card.to} className="card">
            <h2>{card.title}</h2>
            <p>{card.text}</p>
            <button type="button" className="btn-primary" onClick={() => navigate(card.to)}>
              Ir
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Home
