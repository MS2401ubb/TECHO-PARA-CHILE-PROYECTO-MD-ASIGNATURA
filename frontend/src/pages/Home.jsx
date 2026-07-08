import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { apelarPostulante } from '../services/voluntario.service'

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
  const { user, updateUser } = useAuth()
  const [comentarioApelacion, setComentarioApelacion] = useState('')
  const [mensajeApelacion, setMensajeApelacion] = useState('')
  const [errorApelacion, setErrorApelacion] = useState('')

  //const cards = useMemo(() => roleCards[user?.rol] || [], [user?.rol])
  const cards = useMemo(() => {
    if (!user?.rol) return [];
    
    // Tu validación es perfecta: incluye Voluntario pero NO es Encargado
    if (user.rol.includes('Voluntario') && !user.rol.includes('Encargado')) {
      return roleCards['Voluntario'];
    }
    
    return roleCards[user.rol] || [];
  }, [user?.rol]);
  const isVoluntarioRestringido = user?.rol.includes('Voluntario') && user?.estadoVoluntario !== 'Activo'

  const enviarApelacion = async () => {
    setMensajeApelacion('')
    setErrorApelacion('')

    if (!comentarioApelacion.trim() || comentarioApelacion.trim().length < 5) {
      setErrorApelacion('La apelación debe tener al menos 5 caracteres.')
      return
    }

    const result = await apelarPostulante(user?.rut, comentarioApelacion.trim())
    if (!result.success) {
      setErrorApelacion(result.message || 'No fue posible enviar la apelación.')
      return
    }

    updateUser({
      estadoVoluntario: 'Postulante',
      motivoRechazo: null,
      comentarioPostulacion: comentarioApelacion.trim(),
    })
    setComentarioApelacion('')
    setMensajeApelacion('Apelación enviada. Tu solicitud vuelve a estado Postulante.')
  }

  if (isVoluntarioRestringido && user?.estadoVoluntario === 'Postulante') {
    return (
      <section className="page-card">
        <h1>Home</h1>
        <p className="subtitle">Debes esperar a que un Encargado de Voluntarios revise tu solicitud. Te avisaremos pronto.</p>
      </section>
    )
  }

  if (isVoluntarioRestringido && user?.estadoVoluntario === 'Rechazado') {
    return (
      <section className="page-card">
        <h1>Solicitud rechazada</h1>
        <p className="subtitle">Tu solicitud fue rechazada por el siguiente motivo:</p>
        <p><strong>{user?.motivoRechazo || 'Sin motivo informado'}</strong></p>

        <div className="form-row">
          <label htmlFor="apelacion">Apelar</label>
          <textarea
            id="apelacion"
            name="apelacion"
            rows="4"
            value={comentarioApelacion}
            onChange={(event) => setComentarioApelacion(event.target.value)}
            placeholder="Escribe tu nueva experiencia/comentario para apelar"
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn-primary" onClick={enviarApelacion}>Apelar</button>
          {mensajeApelacion && <span className="text-success">{mensajeApelacion}</span>}
          {errorApelacion && <span className="text-error">{errorApelacion}</span>}
        </div>
      </section>
    )
  }

  return (
    <section className="page-card">
      <h1>Home</h1>
      <p className="subtitle">Bienvenido/a, {user?.nombre}!!</p>

      <div className="cards-grid">
        {cards.map((card) => (
          <article key={card.to} className="card">
            <h2>{card.title}</h2>
            <p>{card.text}</p>
            <button type="button" className="btn-primary" onClick={() => {
                console.log("Intentando ir a:", card.to);
                navigate(card.to);
              }}>
              Ir
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Home
