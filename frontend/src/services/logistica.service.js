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

export async function obtenerDetalleProvisionAlimentos(body) {
  try {
    const response = await axios.post('/documento-logistico/provision-alimentos/preview', body)
    return { success: true, data: response.data.data || null }
  } catch (error) {
    return { success: false, message: await extraerMensajeError(error, 'No fue posible calcular la provisión de alimentos') }
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

export async function confirmarRecepcionInventario(idJornada, body) {
  try {
    const response = await axios.post(`/herramientas/${idJornada}/confirmar-recepcion`, body)
    return {
      success: true,
      message: response.data?.message || 'Recepcion de inventario confirmada',
      data: response.data?.data || null,
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Error al confirmar la recepcion de inventario',
      data: error.response?.data?.errorDetails || null,
    }
  }
}

export async function obtenerHerramientasAutorizadasRecepcion(idJornada, codigoCuadrilla) {
  try {
    const response = await axios.get(`/herramientas/${idJornada}/herramientas-autorizadas-recepcion`, {
      params: { codigo_cuadrilla: codigoCuadrilla },
    })
    return {
      success: true,
      message: response.data?.message || 'Herramientas autorizadas obtenidas',
      data: response.data?.data || null,
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Error al obtener herramientas autorizadas para recepción',
      data: error.response?.data?.errorDetails || null,
    }
  }
}

export async function crearJornadaConTareas(body) {
  try {
    const response = await axios.post('/herramientas/iniciar-jornada', body)
    return {
      success: true,
      message: response.data?.message || 'Jornada creada exitosamente',
      data: response.data?.data || null,
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Error al crear la jornada',
      data: error.response?.data?.errorDetails || null,
    }
  }
}

export async function obtenerInventarioJornada(idJornada) {
  try {
    const response = await axios.get(`/herramientas/${idJornada}/inventario`)
    return {
      success: true,
      message: response.data?.message || 'Inventario de jornada obtenido',
      data: response.data?.data || null,
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Error al obtener inventario de jornada',
      data: error.response?.data?.errorDetails || null,
    }
  }
}

export async function cerrarJornada(idJornada, body) {
  try {
    const response = await axios.post(`/herramientas/${idJornada}/finalizar`, body)
    const data = response.data?.data || response.data || null
    return {
      success: true,
      status: response.status,
      message: response.data?.message || response.data?.mensaje || 'Jornada finalizada',
      data,
    }
  } catch (error) {
    return {
      success: false,
      status: error.response?.status,
      message: error.response?.data?.message || error.response?.data?.mensaje || 'Error al cerrar jornada',
      data: error.response?.data || null,
    }
  }
}

export async function obtenerTareasValidacionJornada(idJornada) {
  try {
    const response = await axios.get(`/herramientas/${idJornada}/tareas-validacion`)
    return {
      success: true,
      message: response.data?.message || 'Tareas de validacion obtenidas',
      data: response.data?.data || [],
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Error al obtener tareas de validacion',
      data: error.response?.data?.errorDetails || null,
    }
  }
}

export async function marcarTareaValidacion(idJornada, idTarea, marcar) {
  try {
    const response = await axios.patch(`/herramientas/${idJornada}/tareas-validacion/${idTarea}`, { marcar })
    return {
      success: true,
      message: response.data?.message || 'Tarea actualizada',
      data: response.data?.data || null,
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Error al actualizar tarea',
      data: error.response?.data?.errorDetails || null,
    }
  }
}

export async function confirmarValidacionTecnica(idJornada) {
  try {
    const response = await axios.post(`/herramientas/${idJornada}/confirmar-validacion-tecnica`, {})
    return {
      success: true,
      message: response.data?.message || 'Validacion tecnica confirmada',
      data: response.data?.data || null,
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Error al confirmar validacion tecnica',
      data: error.response?.data?.errorDetails || null,
    }
  }
}

export async function crearTareaValidacionJornada(idJornada, body) {
  try {
    const response = await axios.post(`/herramientas/${idJornada}/tareas-validacion`, body)
    return {
      success: true,
      message: response.data?.message || 'Tarea de validacion creada',
      data: response.data?.data || null,
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Error al crear tarea de validacion',
      data: error.response?.data?.errorDetails || null,
    }
  }
}

export async function obtenerViviendasBloqueadas() {
  try {
    const response = await axios.get('/herramientas/viviendas-bloqueadas')
    return {
      success: true,
      message: response.data?.message || 'Viviendas bloqueadas obtenidas',
      data: response.data?.data || [],
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Error al obtener viviendas bloqueadas',
      data: [],
    }
  }
}

export async function autorizarCierreJornada(idJornada, motivoAutorizacion = 'Autorizado por Central') {
  try {
    const response = await axios.patch(`/herramientas/${idJornada}/autorizar-cierre`, {
      autorizado: true,
      motivo_autorizacion: motivoAutorizacion,
    })
    return {
      success: true,
      message: response.data?.message || 'Cierre autorizado',
      data: response.data?.data || null,
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Error al autorizar cierre',
      data: error.response?.data?.errorDetails || null,
    }
  }
}
