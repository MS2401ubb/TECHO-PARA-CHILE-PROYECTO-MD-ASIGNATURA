import { useState } from 'react'
import { cerrarVivienda } from '../services/vivienda.service'

function CerrarVivienda() {
  const [codigoVivienda, setCodigoVivienda] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [resultado, setResultado] = useState(null)

  const realizarCierre = async () => {
    setMensaje('')
    setError('')
    setResultado(null)

    const codigoNormalizado = codigoVivienda.trim().toUpperCase()
    if (!codigoNormalizado) {
      setError('Debes ingresar un codigo de vivienda.')
      return
    }

    setEnviando(true)
    const response = await cerrarVivienda(codigoNormalizado)

    if (!response.success) {
      setError(response.message || 'No se pudo realizar el cierre de vivienda.')
      setEnviando(false)
      return
    }

    setMensaje(response.message || 'Cierre de vivienda realizado correctamente.')
    setResultado(response.data)
    setEnviando(false)
  }

  return (
    <section className="page-card">
      <h1>Cerrar vivienda</h1>
      <p className="subtitle">
        Ingresa el codigo de vivienda y realiza el cierre. El backend validara que todas sus jornadas esten finalizadas.
      </p>

      <div className="form-row split-2">
        <div>
          <label htmlFor="codigoVivienda">Codigo de vivienda</label>
          <input
            id="codigoVivienda"
            type="text"
            value={codigoVivienda}
            onChange={(event) => setCodigoVivienda(event.target.value)}
            placeholder="Ej: CONC-001"
          />
        </div>
        <div className="inline-actions aligned-bottom">
          <button type="button" className="btn-primary" onClick={realizarCierre} disabled={enviando}>
            {enviando ? 'Cerrando...' : 'Realizar cierre'}
          </button>
        </div>
      </div>

      {mensaje && <p className="text-success calc-status approved">{mensaje}</p>}
      {error && <p className="text-error calc-status rejected">{error}</p>}

      {resultado && (
        <article className="detail-panel">
          <h2>Resultado de cierre</h2>
          {resultado.codigoVivienda && <p><strong>Vivienda:</strong> {resultado.codigoVivienda}</p>}
          {resultado.estado && <p><strong>Estado:</strong> {resultado.estado}</p>}
          {resultado.totalJornadas !== undefined && <p><strong>Total jornadas:</strong> {resultado.totalJornadas}</p>}
          {resultado.jornadasFinalizadas !== undefined && <p><strong>Jornadas finalizadas:</strong> {resultado.jornadasFinalizadas}</p>}
          {resultado.mensaje && <p><strong>Mensaje:</strong> {resultado.mensaje}</p>}
        </article>
      )}
    </section>
  )
}

export default CerrarVivienda
