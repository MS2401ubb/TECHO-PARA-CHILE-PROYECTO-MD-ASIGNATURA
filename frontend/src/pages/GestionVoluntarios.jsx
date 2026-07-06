import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { obtenerCuadrillas, asignarJefe, asignarVoluntario } from '../services/cuadrilla.service'
import { obtenerVoluntariosActivos } from '../services/voluntario.service'

function GestionVoluntarios() {
  const { token } = useAuth()
  const [cuadrillas, setCuadrillas] = useState([])
  const [voluntarios, setVoluntarios] = useState([])
  const [form, setForm] = useState({ codigoCuadrilla: '', rutVoluntario: '', rutJefeCuadrilla: '', fechaInicio: '' })
  const [message, setMessage] = useState('')

  useEffect(() => {
    const load = async () => {
      const [rCuadrillas, rVoluntarios] = await Promise.all([
        obtenerCuadrillas(token),
        obtenerVoluntariosActivos(token),
      ])
      if (rCuadrillas.success) setCuadrillas(rCuadrillas.data)
      if (rVoluntarios.success) setVoluntarios(rVoluntarios.data)
    }
    load()
  }, [token])

  const onChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const onAsignarVoluntario = async () => {
    setMessage('')
    const result = await asignarVoluntario(token, form.codigoCuadrilla, {
      rutVoluntario: form.rutVoluntario,
      fechaInicio: form.fechaInicio,
    })
    setMessage(result.success ? 'Voluntario asignado' : result.message)
  }

  const onAsignarJefe = async () => {
    setMessage('')
    const result = await asignarJefe(token, form.codigoCuadrilla, {
      rutJefeCuadrilla: form.rutJefeCuadrilla,
      fechaInicio: form.fechaInicio,
    })
    setMessage(result.success ? 'Jefe asignado' : result.message)
  }

  return (
    <section className="page-card">
      <h1>Gestionar Voluntarios</h1>
      <p className="subtitle">Asignación de voluntarios y jefes a cuadrillas.</p>

      <div className="form-row split-3">
        <div>
          <label>Cuadrilla</label>
          <select name="codigoCuadrilla" value={form.codigoCuadrilla} onChange={onChange}>
            <option value="">Selecciona</option>
            {cuadrillas.map((c) => <option key={c.codigo} value={c.codigo}>{c.codigo} - {c.descripcion}</option>)}
          </select>
        </div>
        <div>
          <label>RUT voluntario</label>
          <select name="rutVoluntario" value={form.rutVoluntario} onChange={onChange}>
            <option value="">Selecciona</option>
            {voluntarios.map((v) => <option key={v.rutUsuario} value={v.rutUsuario}>{v.rutUsuario}</option>)}
          </select>
        </div>
        <div>
          <label>Fecha inicio</label>
          <input name="fechaInicio" type="date" value={form.fechaInicio} onChange={onChange} />
        </div>
      </div>

      <div className="form-row">
        <label>RUT jefe de cuadrilla</label>
        <input name="rutJefeCuadrilla" value={form.rutJefeCuadrilla} onChange={onChange} placeholder="11111111-1" />
      </div>

      <div className="inline-actions">
        <button type="button" className="btn-primary" onClick={onAsignarVoluntario}>Asignar voluntario</button>
        <button type="button" className="btn-outline" onClick={onAsignarJefe}>Asignar jefe</button>
      </div>

      {message && <p className="helper-text">{message}</p>}
    </section>
  )
}

export default GestionVoluntarios
