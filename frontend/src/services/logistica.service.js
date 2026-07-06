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

export async function descargarDocumentoTransporte(body) {
  try {
    const response = await axios.post('/documento-logistico/documento-transporte', body, {
      responseType: 'blob',
    })
    const blob = response.data
    descargarBlob(blob, 'manifiesto-transporte.pdf')
    return { success: true }
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Error al conectar con el servidor' }
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
    return { success: false, message: error.response?.data?.message || 'Error al conectar con el servidor' }
  }
}
