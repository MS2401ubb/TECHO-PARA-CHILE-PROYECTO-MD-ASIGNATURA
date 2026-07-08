import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { aprobarPostulante, obtenerDetallesVoluntario, obtenerPostulantes, rechazarPostulante } from '../services/voluntario.service'

function Postulantes() {
  const { token } = useAuth()
  const [postulantes, setPostulantes] = useState([])
  const [selected, setSelected] = useState(null)
  const [selectedRut, setSelectedRut] = useState(null)
  const [feedback, setFeedback] = useState('')
  const [motivoRechazo, setMotivoRechazo] = useState('')

  useEffect(() => {
    const loadPostulantes = async () => {
      const result = await obtenerPostulantes()
      if (result.success) setPostulantes(result.data)
    }

    loadPostulantes()
  }, [token])

  const verPostulante = async (rut) => {
    if (selectedRut === rut) {
      setSelected(null)
      setSelectedRut(null)
      setFeedback('')
      setMotivoRechazo('')
      return
    }

    setFeedback('')
    setMotivoRechazo('')
    const result = await obtenerDetallesVoluntario(rut)
    if (result.success) {
      setSelected(result.data)
      setSelectedRut(rut)
    }
  }

  const aprobar = async () => {
    if (!selected?.rutVoluntario) return
    const result = await aprobarPostulante(selected.rutVoluntario, {
      tipoAsignacion: 'automatica',
      fechaInicio: new Date().toISOString().split('T')[0],
    })

    if (!result.success) {
      setFeedback(result.message || 'No fue posible aprobar')
      return
    }

    setFeedback('Postulante aprobado')
    setSelected(null)
    setSelectedRut(null)
    const refreshed = await obtenerPostulantes()
    if (refreshed.success) setPostulantes(refreshed.data)
  }

  const rechazar = async () => {
    if (!selected?.rutVoluntario) return
    if (!motivoRechazo.trim() || motivoRechazo.trim().length < 5) {
      setFeedback('Debes ingresar un motivo de rechazo de al menos 5 caracteres.')
      return
    }

    const result = await rechazarPostulante(selected.rutVoluntario, motivoRechazo.trim())

    if (!result.success) {
      setFeedback(result.message || 'No fue posible rechazar')
      return
    }

    setFeedback('Postulante rechazado')
    setSelected(null)
    setSelectedRut(null)
    setMotivoRechazo('')
    const refreshed = await obtenerPostulantes()
    if (refreshed.success) setPostulantes(refreshed.data)
  }

  return (
    <section className="page-card">
      <h1>Postulantes</h1>
      <p className="subtitle">Valida y decide sobre nuevas postulaciones.</p>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>RUT</th>
              <th>Nombre</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {postulantes.map((item) => (
              <>
                <tr key={item.rutUsuario}>
                  <td>{item.rutUsuario}</td>
                  <td>{item.usuario?.nombre} {item.usuario?.primerApellido}</td>
                  <td>{item.estado}</td>
                  <td>
                    <button type="button" className="btn-outline" onClick={() => verPostulante(item.rutUsuario)}>Ver postulante</button>
                  </td>
                </tr>
                {selectedRut === item.rutUsuario && selected && (
                  <tr key={`${item.rutUsuario}-detalle`}>
                    <td colSpan={4}>
                      <article className="detail-panel">
                        <h2>Ficha del postulante</h2>
                        <p><strong>RUT:</strong> {selected.rutVoluntario}</p>
                        <p><strong>Nombre:</strong> {selected.usuario?.nombre} {selected.usuario?.primerApellido} {selected.usuario?.segundoApellido}</p>
                        <p><strong>Email:</strong> {selected.usuario?.email}</p>
                        <p><strong>Teléfono:</strong> {selected.usuario?.telefono}</p>
                        <p><strong>Experiencia/comentario:</strong> {selected.comentarioPostulacion || 'Sin comentario'}</p>
                        <div className="form-row">
                          <label htmlFor="motivoRechazo">Motivo de rechazo</label>
                          <textarea
                            id="motivoRechazo"
                            name="motivoRechazo"
                            value={motivoRechazo}
                            onChange={(event) => setMotivoRechazo(event.target.value)}
                            rows="3"
                            placeholder="Escribe el motivo específico del rechazo"
                          />
                        </div>
                        <div className="inline-actions">
                          <button type="button" className="btn-primary" onClick={aprobar}>Aceptar</button>
                          <button type="button" className="btn-danger" onClick={rechazar}>Rechazar</button>
                        </div>
                      </article>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>

      {feedback && <p className="helper-text">{feedback}</p>}
    </section>
  )
}

export default Postulantes
