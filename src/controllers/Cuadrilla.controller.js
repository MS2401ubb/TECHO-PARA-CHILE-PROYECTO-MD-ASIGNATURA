//funciones Cuadrilla.routes.js y compartidas con rutas cuadrillasActiva

const listarCuadrillas = async (req,res) =>{
    //compartida con CuadrillaActivas
};

const busquedaConFiltroCuadrillas = async (req,res) =>{

};

const mostrarInfoCuadrilla = async (req,res) =>{

};

//funciones CuadrillaActiva.routes.js

const listarRegionesConZonaRiesgo = async (req,res) =>{

};

const obtenerPersonalAsignado = async (req,res) =>{

};

const obtenerPersonalDisponible = async (req,res) =>{

};

const crearCuadrilla = async (req,res) =>{

};

//aca iría función de ruta '/:id/:fecha_inicio/asignar-jefe', pero no tengo claro nombre ni utilidad real.

const obtenerDetallesUbicacion = async (req,res) =>{

};

const obtenerInformacionCuadrilla = async (req,res) =>{

};

module.exports = {
    listarCuadrillas,
    busquedaConFiltroCuadrillas,
    mostrarInfoCuadrilla,
    listarRegionesConZonaRiesgo,
    obtenerPersonalAsignado,
    obtenerPersonalDisponible,
    crearCuadrilla,
    obtenerDetallesUbicacion,
    obtenerInformacionCuadrilla
}