import db from '../config/configDb.js';

const { In, IsNull } = require('typeorm');



import viviendas from '../entities/vivienda.entity.js';
const viviendasRepository = db.getRepository(viviendas);
import cuadrillaTrabaja from '../entities/cuadrillaTrabajaEnVivienda.entity.js';
const cuadrillaTrabajaRepository = db.getRepository(cuadrillaTrabaja);
import voluntarios from '../entities/voluntario.entity.js';
const voluntariosRepository = db.getRepository(voluntarios);

import voluntarioParticipa from '../entities/voluntarioParticipaEnCuadrilla.entity.js';
const voluntarioParticipaRepository = db.getRepository('VoluntarioParticipaEnCuadrilla');

// TRANSPORTE
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
export const generarDocumentoTransporte = async (data) => {

    const {codigoCiudad, trasladoPuntoOrigen} = data;

    const viviendasEnCiudad = await viviendasRepository.find({
        where: {
            ciudad: { codigo: codigoCiudad },
            estado: 'Planificacion'
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

    if (!viviendasEnCiudad || viviendasEnCiudad.length === 0) {
        throw new Error('No hay viviendas en planificación para esta zona.');
    }

    // Llamamos a las subfunciones
    const listaVoluntarios = obtenerListaVoluntariosTransporte(viviendasEnCiudad);
    const destinos = obtenerZonasDeDestino(viviendasEnCiudad);

    const totalPasajeros = listaVoluntarios.length;

    // Retornamos el objeto estructurado listo para que la librería PDF dibuje el reporte
    return {
        informacionLogistica: {
            origen: trasladoPuntoOrigen,
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


// ALIMENTACION
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
 * @returns {number} Total de voluntarios activos en la zona
 */
const obtenerTotalVoluntariosActivosEnZona = async (cuadrillaTrabaja) => {
    if (!cuadrillaTrabaja || cuadrillaTrabaja.length === 0) return 0;
    
    const codigosCuadrillasZona = cuadrillaTrabaja.map((asignacion) => asignacion.codigoCuadrilla);

    const participaciones = await voluntarioParticipaRepository.find({
        where: { codigoCuadrilla: In(codigosCuadrillasZona), fechaFin: IsNull() },
        relations: { voluntario: true }
    });
    //Recorrer los voluntarios activos del sistema
    const rutsUnicos = new Set();
    for (const p of participaciones) {
        if (p.voluntario && p.voluntario.estado === 'Activo') {
            rutsUnicos.add(p.rutVoluntario);
        }
    }

    return rutsUnicos.size;
};
/**
 * Calcular raciones de alimentos y generar documento de pedido de insumos
 * @param {string} codigoVivienda - codigo de vivienda
 * @param {string} rutEncargado - RUT del encargado que realiza la solicitud
 */
export const generarDocumentoProvisionAlimentos = async (codigoVivienda, rutEncargado) => {
    // 1. Normalizamos el código para evitar espacios en blanco inesperados
    const codigoViviendaNormalizado = codigoVivienda?.trim();
    if (!codigoViviendaNormalizado) {
        throw new Error('El código de vivienda es obligatorio.');
    }

    // 2. Buscamos la vivienda para verificar que exista
    const viviendaEncontrada = await viviendasRepository.findOneBy({ codigo: codigoViviendaNormalizado });

    if (!viviendaEncontrada) {
        console.log(`No se encontró la vivienda con código ${codigoViviendaNormalizado}`);
        throw new Error('La vivienda o zona de construcción especificada no existe.');
    }
    
    const fechaFinLogistica = viviendaEncontrada.fechaFinEstimada;
    // 3. Verificamos si la zona tiene una fecha asignada (requisito obligatorio)
    if (!viviendaEncontrada.fechaInicioEstimada || !fechaFinLogistica) {
        throw new Error('El sistema no permitirá generar la orden de raciones si la zona de construcción no tiene una fecha de término definida.');
    }

    // 4. Obtener las cuadrillas de la zona utilizando el código normalizado
    const cuadrillaTrabaja = await cuadrillaTrabajaRepository.find({
        where: { codigoVivienda: codigoViviendaNormalizado }
    });

    if (!cuadrillaTrabaja || cuadrillaTrabaja.length === 0) {
        throw new Error('No hay cuadrillas asignadas a esta vivienda.');
    }

    // 5. Contar voluntarios activos asignados en la zona (Llamada única y asíncrona)
    const totalVoluntariosActivosEnZona = await obtenerTotalVoluntariosActivosEnZona(cuadrillaTrabaja);

    if (totalVoluntariosActivosEnZona === 0) {
        throw new Error('No se encontraron voluntarios activos asignados a las cuadrillas de esta zona.');
    }

    // 6. Calcular la cantidad de días de estancia
    const diasEstancia = calcularDiasEstancia(viviendaEncontrada.fechaInicioEstimada, fechaFinLogistica);

    // 7. Determinar el volumen total de porciones necesarias (desayuno, almuerzo, cena) al día
    const totalRaciones = totalVoluntariosActivosEnZona * diasEstancia * 3; 

    // 8. Retornamos la estructura del documento para el pedido de insumos
    return {
        documentoTipo: "PEDIDO_OFICIAL_INSUMOS_ALIMENTACION",
        fechaGeneracion: new Date(), 
        detalleZona: {
            codigoVivienda: viviendaEncontrada.codigo,
            descripcion: viviendaEncontrada.direccion,
            diasEstancia: diasEstancia
        },
        calculoLogistico: {
            voluntariosActivos: totalVoluntariosActivosEnZona,
            racionesPorPersonaAlDia: 3,
            totalRacionesDeterminadas: totalRaciones 
        },
        respaldoGasto: {
            gestionadoPorRut: rutEncargado,
            mensaje: "Este documento sirve como respaldo para la coordinación con proveedores de alimentos y para la entrega logística en terreno."
        }
    };
};

export default {
    generarDocumentoTransporte,
    generarDocumentoProvisionAlimentos,
};
