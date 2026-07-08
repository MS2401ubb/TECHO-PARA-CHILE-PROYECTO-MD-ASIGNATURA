import axios from './root.service.js'

export async function obtenerCuadrillas() {
  try {
    const response = await axios.get('/cuadrilla')
    return { success: true, data: response.data.data || [] }
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Error al conectar con el servidor', data: [] }
  }
}

export async function asignarVoluntario(codigoCuadrilla, body) {
  try {
    const response = await axios.post(`/cuadrilla/${codigoCuadrilla}/asignar-voluntario`, body)
    return { success: true, data: response.data.data, message: response.data.message }
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Error al conectar con el servidor' }
  }
}

export async function asignarJefe(codigoCuadrilla, body) {
  try {
    const response = await axios.post(`/cuadrilla/${codigoCuadrilla}/asignar-jefe-cuadrilla`, body)
    return { success: true, data: response.data.data, message: response.data.message }
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Error al conectar con el servidor' }
  }
}

export async function obtenerMiCuadrillaYVivienda() {
  try {
    const response = await axios.get('/cuadrilla/mi-cuadrilla-vivienda')
    return { success: true, data: response.data.data }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Error al conectar con el servidor',
      data: null,
    }
  }
}

export async function canjearTokenExpress(body){
  try{
    const response = await axios.post('/cuadrilla/token/canjear',body);
    return{ success: true, data:response.data.data,message:response.data.message}
  }catch(error){
    return {success:false, message: error.response?.data?.message || "Error al conectar con el servidor"}
  }

}

export async function verificarTokenExistente(codigoCuadrilla){
  try{
    const response = await axios.get(`cuadrilla/${codigoCuadrilla}/existe-token`);
    return response.data;
  }catch(error){
    return error.response?.data || {success: false};
  }
}

export async function crearTokenJornada(codigoCuadrilla){
  try{
    const response = await axios.post(`/cuadrilla/${codigoCuadrilla}/token`);
    return { success: true, data:response.data.data, message:response.data.message}
  }catch(error){
    return {success:false,message:error.response?.data?.message || "Error al conectar con el servidor "}
  }
}
