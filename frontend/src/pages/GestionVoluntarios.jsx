import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { obtenerCuadrillas, asignarCuadrillaAVivienda, asignarJefe, asignarVoluntario } from '../services/cuadrilla.service'
import { obtenerVoluntariosActivos } from '../services/voluntario.service'
import { obtenerJefesCuadrilla } from '../services/user.service'
import { obtenerViviendas } from '../services/vivienda.service'

function GestionVoluntarios() {
  const { token } = useAuth()
  const [cuadrillas, setCuadrillas] = useState([])
  const [viviendas, setViviendas] = useState([])
  const [voluntarios, setVoluntarios] = useState([])
  const [jefes, setJefes] = useState([])
  const [formVivienda, setFormVivienda] = useState({
    codigoCuadrilla: '',
    codigoVivienda: '',
    fechaInicio: '',
  })
  const [formVoluntario, setFormVoluntario] = useState({
    codigoCuadrilla: '',
    rutVoluntario: '',
    fechaInicio: '',
  })
  const [formJefe, setFormJefe] = useState({
    codigoCuadrilla: '',
    rutJefeCuadrilla: '',
    fechaInicio: '',
  })
  const [message, setMessage] = useState('')

  useEffect(() => {
    const load = async () => {
      const [rCuadrillas, rViviendas, rVoluntarios, rJefes] = await Promise.all([
        obtenerCuadrillas(),
        obtenerViviendas(),
        obtenerVoluntariosActivos(),
        obtenerJefesCuadrilla(),
      ])
      if (rCuadrillas.success) setCuadrillas(rCuadrillas.data)
      if (rViviendas.success) setViviendas((rViviendas.data || []).filter((vivienda) => vivienda.estado !== 'Finalizada'))
      if (rVoluntarios.success) setVoluntarios(rVoluntarios.data)
      if (rJefes.success) setJefes(rJefes.data)
    }
    load()
  }, [token])

  const onChangeVivienda = (event) => {
    const { name, value } = event.target
    setFormVivienda((prev) => ({ ...prev, [name]: value }))
  }

  const onChangeVoluntario = (event) => {
    const { name, value } = event.target
    setFormVoluntario((prev) => ({ ...prev, [name]: value }))
  }

  const onChangeJefe = (event) => {
    const { name, value } = event.target
    setFormJefe((prev) => ({ ...prev, [name]: value }))
  }

  const onAsignarVoluntario = async () => {
    setMessage('')
    const result = await asignarVoluntario(formVoluntario.codigoCuadrilla, {
      rutVoluntario: formVoluntario.rutVoluntario,
      fechaInicio: formVoluntario.fechaInicio,
    })
    setMessage(result.success ? 'Voluntario asignado a la cuadrilla correctamente.' : result.message)

    if (result.success) {
      setFormVoluntario({ codigoCuadrilla: '', rutVoluntario: '', fechaInicio: '' })
    }
  }

  const onAsignarVivienda = async () => {
    setMessage('')
    const result = await asignarCuadrillaAVivienda(formVivienda.codigoCuadrilla, {
      codigoVivienda: formVivienda.codigoVivienda,
      fechaInicio: formVivienda.fechaInicio,
    })
    setMessage(result.success ? 'Cuadrilla asignada a vivienda correctamente.' : result.message)

    if (result.success) {
      setFormVivienda({ codigoCuadrilla: '', codigoVivienda: '', fechaInicio: '' })
    }
  }

  const onAsignarJefe = async () => {
    setMessage('')
    const result = await asignarJefe(formJefe.codigoCuadrilla, {
      rutJefeCuadrilla: formJefe.rutJefeCuadrilla,
      fechaInicio: formJefe.fechaInicio,
    })
    setMessage(result.success ? 'Jefe de cuadrilla asignado correctamente.' : result.message)

    if (result.success) {
      setFormJefe({ codigoCuadrilla: '', rutJefeCuadrilla: '', fechaInicio: '' })
    }
  }

  return (
    <section className="page-card">
      <h1>Gestionar Distribución Laboral</h1>
      <p className="subtitle">Asignación de voluntarios y jefes de cuadrilla a cuadrillas mediante selección directa.</p>

      <article className="detail-panel">
        <h2>Asignar Cuadrillas a Viviendas</h2>
        <div className="form-row split-3">
          <div>
            <label>Cuadrilla</label>
            <select name="codigoCuadrilla" value={formVivienda.codigoCuadrilla} onChange={onChangeVivienda}>
              <option value="">Selecciona una cuadrilla</option>
              {cuadrillas.map((cuadrilla) => (
                <option key={cuadrilla.codigo} value={cuadrilla.codigo}>{cuadrilla.codigo} - {cuadrilla.descripcion}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Vivienda</label>
            <select name="codigoVivienda" value={formVivienda.codigoVivienda} onChange={onChangeVivienda}>
              <option value="">Selecciona una vivienda</option>
              {viviendas.map((vivienda) => (
                <option key={vivienda.codigo} value={vivienda.codigo}>
                  {vivienda.codigo} - {vivienda.direccion} ({vivienda.estado})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Fecha inicio</label>
            <input name="fechaInicio" type="date" value={formVivienda.fechaInicio} onChange={onChangeVivienda} />
          </div>
        </div>

        <div className="inline-actions">
          <button type="button" className="btn-primary" onClick={onAsignarVivienda}>Asignar cuadrilla a vivienda</button>
        </div>
      </article>

      <article className="detail-panel">
        <h2>Asignar Voluntarios a Cuadrillas</h2>
        <div className="form-row split-3">
          <div>
            <label>Cuadrilla</label>
            <select name="codigoCuadrilla" value={formVoluntario.codigoCuadrilla} onChange={onChangeVoluntario}>
              <option value="">Selecciona una cuadrilla</option>
              {cuadrillas.map((cuadrilla) => (
                <option key={cuadrilla.codigo} value={cuadrilla.codigo}>{cuadrilla.codigo} - {cuadrilla.descripcion}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Voluntario</label>
            <select name="rutVoluntario" value={formVoluntario.rutVoluntario} onChange={onChangeVoluntario}>
              <option value="">Selecciona un voluntario</option>
              {voluntarios.map((voluntario) => (
                <option key={voluntario.rutUsuario} value={voluntario.rutUsuario}>
                  {voluntario.rutUsuario} - {voluntario.usuario?.nombre || 'Sin nombre'} {voluntario.usuario?.primerApellido || ''}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Fecha inicio</label>
            <input name="fechaInicio" type="date" value={formVoluntario.fechaInicio} onChange={onChangeVoluntario} />
          </div>
        </div>

        <div className="inline-actions">
          <button type="button" className="btn-primary" onClick={onAsignarVoluntario}>Asignar Voluntario</button>
        </div>
      </article>

      <article className="detail-panel">
        <h2>Asignar Jefes de Cuadrilla a Cuadrillas</h2>
        <div className="form-row split-3">
          <div>
            <label>Cuadrilla</label>
            <select name="codigoCuadrilla" value={formJefe.codigoCuadrilla} onChange={onChangeJefe}>
              <option value="">Selecciona una cuadrilla</option>
              {cuadrillas.map((cuadrilla) => (
                <option key={cuadrilla.codigo} value={cuadrilla.codigo}>{cuadrilla.codigo} - {cuadrilla.descripcion}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Jefe de cuadrilla</label>
            <select name="rutJefeCuadrilla" value={formJefe.rutJefeCuadrilla} onChange={onChangeJefe}>
              <option value="">Selecciona un jefe</option>
              {jefes.map((jefe) => (
                <option key={jefe.rutUsuario} value={jefe.rutUsuario}>
                  {jefe.rutUsuario} - {jefe.usuario?.nombre || 'Sin nombre'} {jefe.usuario?.primerApellido || ''}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Fecha inicio</label>
            <input name="fechaInicio" type="date" value={formJefe.fechaInicio} onChange={onChangeJefe} />
          </div>
        </div>

        <div className="inline-actions">
          <button type="button" className="btn-outline" onClick={onAsignarJefe}>Asignar Jefe de Cuadrilla</button>
        </div>
      </article>

      {message && <p className="helper-text">{message}</p>}
    </section>
  )
}

export default GestionVoluntarios
