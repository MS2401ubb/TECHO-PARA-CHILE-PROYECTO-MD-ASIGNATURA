import axios from './root.service.js'

function descargarBlob(blob, filename) {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

async function extraerMensajeError(error, fallbackMessage) {
  const data = error.response?.data

  if (data instanceof Blob) {
    try {
      const text = await data.text()
      const parsed = JSON.parse(text)
      return parsed?.message || parsed?.error || fallbackMessage
    } catch {
      return fallbackMessage
    }
  }

  return data?.message || data?.error || fallbackMessage
}

export async function descargarDocumentoTransporte(body) {
  try {
    const response = await axios.post('/documento-logistico/documento-transporte', body, {
      responseType: 'blob',
    })
    const blob = response.data
    descargarBlob(blob, 'manifiesto-transporte.pdf')
    return { success: true }
  } catch (error) {
    return { success: false, message: await extraerMensajeError(error, 'Error al conectar con el servidor') }
  }
}

export async function descargarDocumentoAlimentacion(body) {
  try {
    const response = await axios.post('/documento-logistico/documento-provision-alimentos', body, {
      responseType: 'blob',
    })
    const blob = response.data
    descargarBlob(blob, 'provision-alimentos.pdf')
    return { success: true }
  } catch (error) {
    return { success: false, message: await extraerMensajeError(error, 'Error al conectar con el servidor') }
  }
}

export async function obtenerCatalogoHerramientas() {
  try {
    const response = await axios.get('/herramientas')
    return { success: true, data: response.data.data || [] }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Error al conectar con el servidor',
      data: [],
    }
  }
}

export async function validarSuficienciaHerramientas(body) {
  try {
    const response = await axios.post('/herramientas/validar-suficiencia', body)
    return {
      success: true,
      message: response.data?.message || 'Validación de herramientas realizada',
      data: response.data?.data || null,
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Error al validar suficiencia de herramientas',
      data: error.response?.data?.errorDetails || null,
    }
  }
}
