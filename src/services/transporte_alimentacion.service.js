const db = require('../config/db');

const viviendas = require('../entities/Vivienda.entity');
const viviendasRepository = db.getRepository(viviendas);

const cuadrillaTrabaja = require('../entities/CuadrillaTrabajaEnVivienda.entity');
const cuadrillaTrabajaRepository = db.getRepository('CuadrillaTrabajaEnVivienda');

const voluntarios = require('../entities/Voluntario.entity');
const voluntariosRepository = db.getRepository('voluntario');    


const obtenerListaVoluntariosTransporte = (viviendasEnCiudad) => {
    const listaVoluntarios = [];
    
    for (const vivienda of viviendasEnCiudad) {
        for (const relacionCuadrilla of vivienda.cuadrillasTrabajando) {
            const cuadrilla = relacionCuadrilla.cuadrilla;
            for (const relacionVoluntario of cuadrilla.voluntariosParticipando) {
                const voluntario = relacionVoluntario.voluntario;
                const datosUsuario = voluntario.usuario;

                // Validación exigida por el requisito:
                if (!voluntario.telefonoEmergencia) {
                    throw new Error(`El voluntario ${datosUsuario.nombre} no tiene registrado un contacto de emergencia.`);
                }

                // Evitamos duplicar voluntarios si participan en más de algo (seguridad)
                if (!listaVoluntarios.some(v => v.rut === datosUsuario.rut)) {
                    listaVoluntarios.push({
                        rut: datosUsuario.rut,
                        nombreCompleto: `${datosUsuario.nombre} ${datosUsuario.primerApellido} ${datosUsuario.segundoApellido || ''}`.trim(),
                        telefonoEmergencia: voluntario.telefonoEmergencia,
                        cuadrilla: cuadrilla.descripcion || cuadrilla.codigo
                    });
                }
            }
        }
    }
    return listaVoluntarios;
};


const obtenerZonasDeDestino = (viviendasEnCiudad) => {
    return viviendasEnCiudad.map(vivienda => ({
        codigoVivienda: vivienda.codigo,
        direccionDestino: vivienda.direccion,
        fechaInicio: vivienda.fechaInicioEstimada,
        fechaFin: vivienda.fechaFinEstimada
    }));
};

/**
 * @param {string} codigoCiudad - Código de la comuna
 * @param {string} puntoOrigen - Origen escrito por el encargado
 */
const generarDocumentoTransporte = async (codigoCiudad, puntoOrigen) => {
    const viviendasEnCiudad = await viviendasRepository.find({
        where: { 
            ciudad: { codigo: codigoCiudad }, 
            estado: 'planificacion' 
        },
        relations: {
        cuadrillasTrabajando: {
            cuadrilla: {
            voluntariosParticipando: {
                voluntario: {
                usuario: true
                }
            }
            }
        }
        }
    });

    if (!viviendasEnCiudad) {
        throw new Error('No hay viviendas en planificación para esta zona.');
    }

    // Llamamos a las subfunciones
    const listaVoluntarios = obtenerListaVoluntariosTransporte(viviendasEnCiudad);
    const destinos = obtenerZonasDeDestino(viviendasEnCiudad);

    const totalPasajeros = listaVoluntarios.length;

    // Retornamos el objeto estructurado listo para que la librería PDF dibuje el reporte
    return {
        informacionLogistica: {
            origen: puntoOrigen,
            totalPasajeros: totalPasajeros,
            // fechaSalida que sea una fecha mínima entre todas las viviendas en planificación, para sugerir la fecha de salida al chofer. Formato YYYY-MM-DD
            fechaSalida:  
                viviendasEnCiudad.reduce((fechaMin, vivienda) => {
                    const fechaInicio = new Date(vivienda.fechaInicioEstimada);
                    return fechaInicio < fechaMin ? fechaInicio : fechaMin;
                }, new Date(viviendasEnCiudad[0].fechaInicioEstimada)).toISOString().split('T')[0] // Formato YYYY-MM-DD
        },
        destinos: destinos, // Lista de paradas/casas
        voluntarios: listaVoluntarios // Lista detallada para el chofer
    };
};

//module.exports = {generarDocumentoTransporte};


/**
 * Calcula la cantidad de días transcurridos entre dos fechas
 * @param {string} fechaInicio 
 * @param {string} fechaFin 
 * @returns {number} Cantidad de días
 */
const calcularDiasEstancia = (fechaInicio, fechaFin) => {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const milisegundos = 24 * 60 * 60 * 1000; //calculo de horas*minutos*segundos*milisegundos
    const milisegundosTranscurridos = Math.abs(inicio.getTime() - fin.getTime());
    const diasTranscurridos = Math.round(milisegundosTranscurridos / milisegundos);
    
    return diasTranscurridos; 
};

/**
 * Contabiliza los voluntarios activos asignados a las cuadrillas de una vivienda
 * @param {Array} cuadrillaTrabaja - Lista de asignaciones de la tabla intermedia
 * @param {Array} voluntariosActivos - Lista de todos los voluntarios activos del sistema
 * @returns {number} Total de voluntarios activos en la zona
 */
const obtenerTotalVoluntariosActivosEnZona = (cuadrillaTrabaja, voluntariosActivos) => {

    let totalVoluntarios = 0;

    //Recorrer cada cuadrilla asignada a la vivienda
    for (const asignacion of cuadrillaTrabaja) {
        const codigoCuadrillaAsignada = asignacion.codigoCuadrilla;

        //Recorrer los voluntarios activos del sistema
        for (const voluntario of voluntariosActivos) {
            
            // Validamos que la cuadrilla de voluntarios sea de la zona
            if (voluntario.codigoCuadrilla === codigoCuadrillaAsignada) {
                totalVoluntarios++;
            }
        }
    }

    return totalVoluntarios;
};

/**
 * Calcular raciones de alimentos y generar documento de pedido de insumos
 * @param {string} codigoVivienda - codigo de vivienda
 * @param {string} rutEncargado - RUT del encargado que realiza la solicitud
 */
const generarDocumentoProvisionAlimentos = async (codigoVivienda, rutEncargado) => {
    //Buscamos la vivienda para verificar que exista
    const vivienda = await viviendasRepository.findOneBy({ codigo: codigoVivienda });

    if (!vivienda) {
        throw new Error('La vivienda o zona de construcción especificada no existe.');
    }
    
    const fechaFinLogistica = vivienda.fechaFinEstimada;
    //verificamos si la zona tiene una fecha asignada, este requisito es obligatorio para la racion de alimentos
    if (!vivienda.fechaInicioEstimada || !fechaFinLogistica) {
        throw new Error('El sistema no permitirá generar la orden de raciones si la zona de construcción no tiene una fecha de término definida.');
    }

    //Obtener las cuadrillas de la zona
    const cuadrillaTrabaja = await cuadrillaViviendaRepository.find({
        where: { codigoVivienda: codigoVivienda }
    });

    if (!cuadrillaTrabaja || cuadrillaTrabaja.length === 0) {
        throw new Error('No hay cuadrillas asignadas a esta zona de construcción.');
    }

    //Obtener voluntarios activos en el sistema
    const voluntariosActivos = await voluntarioRepository.find({
        where: { estado: 'activo' }
    });

    //llamamos la funcion obtenerTotalVoluntariosActivosEnZona
    const totalVoluntariosActivosEnZona = obtenerTotalVoluntariosActivosEnZona(cuadrillaTrabaja, voluntariosActivos);

    if (totalVoluntariosActivosEnZona === 0) {
        throw new Error('No se encontraron voluntarios activos asignados a las cuadrillas de esta zona.');
    }

    //Calcular la cantidad de días de estancia
    const diasEstancia = calcularDiasEstancia(vivienda.fechaInicioEstimada, fechaFinLogistica);

    //Determinar el volumen total de porciones necesarias (desayuno,almuerzo,cena) al dia
    const totalRaciones = totalVoluntariosActivosEnZona * diasEstancia * 3; 

    //Retornamos la estructura del documento para el pedido de insumos
    return {
        documentoTipo: "PEDIDO_OFICIAL_INSUMOS_ALIMENTACION",
        fechaGeneracion: new Date(), //generar una fecha para el documento
        detalleZona: {
            codigoVivienda: vivienda.codigo,
            descripcion: vivienda.descripcion,
            diasEstancia: diasEstancia
        },
        calculoLogistico: {
            voluntariosActivos: totalVoluntariosActivos,
            racionesPorPersonaAlDia: 3,
            totalRacionesDeterminadas: totalRaciones //Atributo calculado solicitado
        },
        respaldoGasto: {
            gestionadoPorRut: rutEncargado,
            mensaje: "Este documento sirve como respaldo para la coordinación con proveedores de alimentos y para la entrega logística en terreno."
        }
    };
};

module.exports = {
    generarDocumentoTransporte,
    generarDocumentoProvisionAlimentos
};
