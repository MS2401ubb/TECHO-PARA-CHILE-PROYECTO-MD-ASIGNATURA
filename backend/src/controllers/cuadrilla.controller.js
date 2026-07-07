import {
  getCuadrillasService,
  getCuadrillaByCodigoService,
  editCuadrillaService,
  deleteCuadrillaService,
  asignarVoluntarioACuadrillaService,
  asignarJefeCuadrillaACuadrillaService,
  getMiCuadrillaYViviendaService,
  obtenerToken,
  canjearTokenExpress,
  preValidacionToken
} from "../services/cuadrilla.service.js";
import {tokenCanjeoBodyValidation} from "../validations/token.validation.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";


export async function getCuadrillas(req, res) {
  try {
    const cuadrillas = await getCuadrillasService();

    if (cuadrillas.length < 1) {
      handleSuccess(res, 200, "No hay cuadrillas registradas");
    }

    handleSuccess(res, 200, "Cuadrillas obtenidas exitosamente", cuadrillas);
  } catch (error) {
    handleErrorServer(res, 500, "Error al obtener cuadrillas", error.message);
  }
}

export async function getCuadrillaByCodigo(req, res) {
  try {
    const { codigo } = req.params;
    const cuadrilla = await getCuadrillaByCodigoService(codigo);

    handleSuccess(res, 200, "Cuadrilla encontrada", cuadrilla);
  } catch (error) {
    if (error.message === "Cuadrilla no encontrada") {
      handleErrorClient(res, 404, error.message);
    } else {
      handleErrorServer(res, 500, "Error al obtener la cuadrilla", error.message);
    }
  }
}

export async function editCuadrilla(req, res) {
  try {
    const { codigo } = req.params;
    const { body } = req;

    if (!body) return handleErrorClient(res, 400, "Debe especificar al menos 1 parámetro");

    const updatedCuadrilla = await editCuadrillaService(codigo, body);

    handleSuccess(res, 200, "Cuadrilla actualizada exitosamente", updatedCuadrilla);
  } catch (error) {
      return handleErrorServer(res, 500, "Error interno del servidor", error.message);
    
  }
}

export async function deleteCuadrilla(req, res) {
  try {
    const { codigo } = req.params;
    const result = await deleteCuadrillaService(codigo);

    if (!result) return handleErrorClient(res, 404, "Cuadrilla no encontrada");

    handleSuccess(res, 200, "Cuadrilla eliminada exitosamente");
  } catch (error) {
    handleErrorServer(res, 500, "Error al eliminar cuadrilla", error.message);
  }
}

export async function asignarVoluntarioACuadrilla(req, res) {
  try {
    const { codigo } = req.params;
    const { rutVoluntario, fechaInicio } = req.body;

    if (!rutVoluntario) {
      return handleErrorClient(res, 400, "El rutVoluntario es obligatorio");
    }

    const data = await asignarVoluntarioACuadrillaService(rutVoluntario, codigo, fechaInicio);
    handleSuccess(res, 201, "Voluntario asignado a cuadrilla exitosamente", data);
  } catch (error) {
    if (error.message.includes("no encontrado")) {
      return handleErrorClient(res, 404, error.message);
    }
    if (
      error.message.includes("Solo se pueden asignar") ||
      error.message.includes("ya está asignado") ||
      error.message.includes("código") ||
      error.message.includes("fechaInicio")
    ) {
      return handleErrorClient(res, 400, error.message);
    }
    handleErrorServer(res, 500, "Error al asignar voluntario a cuadrilla", error.message);
  }
}

export async function asignarJefeCuadrillaACuadrilla(req, res) {
  try {
    const { codigo } = req.params;
    const { rutJefeCuadrilla, fechaInicio } = req.body;

    if (!rutJefeCuadrilla) {
      return handleErrorClient(res, 400, "El rutJefeCuadrilla es obligatorio");
    }

    const data = await asignarJefeCuadrillaACuadrillaService(rutJefeCuadrilla, codigo, fechaInicio);
    handleSuccess(res, 201, "Jefe de cuadrilla asignado exitosamente", data);
  } catch (error) {
    if (error.message.includes("no encontrado")) {
      return handleErrorClient(res, 404, error.message);
    }
    if (
      error.message.includes("ya lidera") ||
      error.message.includes("ya tiene") ||
      error.message.includes("código") ||
      error.message.includes("fechaInicio")
    ) {
      return handleErrorClient(res, 400, error.message);
    }
    handleErrorServer(res, 500, "Error al asignar jefe de cuadrilla", error.message);
  }
}

//POST /api//:codigo/token
export async function getTokenCuadrilla(req,res) {
  try{
    const {codigo} = req.params;
    const rutJefeCuadrilla= req.user.rut;

    const data = await obtenerToken(rutJefeCuadrilla,codigo);
    handleSuccess(res,201,"Token creado exitosamente",data);//data muestra código, para que Jefe de Cuadrilla lo muestre a Voluntario
  }catch (error){//Revisar error messages
    if (error.message.includes("no encontrado") || error.message.includes("no encontrada")) {
      return handleErrorClient(res, 404, error.message);
    }
if (
      error.message.includes("jefe activo") ||
      error.message.includes("entero positivo")
    ) {
      return handleErrorClient(res, 400, error.message);
    }
    handleErrorServer(res,500,"Error al generar Token de asignación a cuadrilla",error.message);
  }
}

//POST /api/cuadrillas/token/canjear
//const {tipoVoluntario,datosUsuarioNuevo,tokenEntregado} = req.body //en frontend, orden debería ser: token --> datos usuario? y "tipoVoluntario" viene "asumido"
export async function getTokenVoluntario(req,res){
  try{
    const {error, value} = tokenCanjeoBodyValidation.validate(req.body);

    if(error) return handleErrorClient(res,400,"parámetros de canje inválidos",error.message);
    const {tipoVoluntario, tokenEntregado, datosUsuarioNuevo} = value;

    const resultado = await canjearTokenExpress(tipoVoluntario,datosUsuarioNuevo,tokenEntregado);
    handleSuccess(res,200,resultado.message,resultado);
  }catch(error){//REVISAR ERROR MESSAGES
    if(error.message.includes("no es válido") || error.message.includes("expiró")){
      return handleErrorClient(res, 400, error.message);
    }
    if (error.message.includes("pertenece a un usuario pero no")) {
      return handleErrorClient(res, 403, error.message); // Forbidden o Bad Request según prefieras
    }

    // Error crítico del servidor
    handleErrorServer(res, 500, "Error al procesar el canje del token express", error.message);
  }
}

export async function validarTokenExpress(req,res){
  try{
    const {token} = req.params;

    const tokenValido = await preValidacionToken(token);

    if (!tokenValido) {
      return handleErrorClient(res, 400, "El token no es válido o ya expiró.");
    }

    // Si es válido, le mandamos al front la info de la cuadrilla a la que se va a unir
    handleSuccess(res, 200, "Token válido", { codigoCuadrilla: tokenValido.codigoCuadrilla });
  } catch (error) {
    handleErrorServer(res, 500, "Error al validar token", error.message);
  }
}

export async function getMiCuadrillaYVivienda(req, res) {
  try {
    const rutUsuario = req.user?.rut;
    const rolUsuario = req.user?.rol;

    if (!rutUsuario || !rolUsuario) {
      return handleErrorClient(res, 401, "Usuario no autenticado");
    }

    const data = await getMiCuadrillaYViviendaService(rutUsuario, rolUsuario);
    return handleSuccess(res, 200, "Datos de cuadrilla y vivienda obtenidos exitosamente", data);
  } catch (error) {
    if (
      error.message.includes("No tienes una cuadrilla activa") ||
      error.message.includes("No lideras una cuadrilla activa") ||
      error.message.includes("solo está disponible")
    ) {
      return handleErrorClient(res, 400, error.message);
    }
    return handleErrorServer(res, 500, "Error al obtener datos de cuadrilla y vivienda", error.message);
  }
}