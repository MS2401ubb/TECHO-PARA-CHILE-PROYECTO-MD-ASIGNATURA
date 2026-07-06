import db from '../config/configDb.js';

const viviendasRepository = db.getRepository('Vivienda');
const cuadrillaTrabajaRepository = db.getRepository('CuadrillaTrabajaEnVivienda');
const voluntariosRepository = db.getRepository('Voluntario');
const jefeCuadrillaLideraCuadrillaRepository = db.getRepository('JefeCuadrillaLideraCuadrilla');


// TRANSPORTE
const obtenerListaVoluntariosAndJefeCuadrillasTransporte = async (viviendasEnCiudad) => {
    const listaVoluntariosAndJefes = [];
    
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
                if (!listaVoluntariosAndJefes.some((v) => v.rut === datosUsuario.rut)) {
                    listaVoluntariosAndJefes.push({
                        rut: datosUsuario.rut,
                        nombreCompleto: `${datosUsuario.nombre} ${datosUsuario.primerApellido} ${datosUsuario.segundoApellido || ''}`.trim(),
                        telefonoEmergencia: voluntario.telefonoEmergencia,
                        cuadrilla: cuadrilla.codigo
                    });
                }
            }
        }
    }
    for (const vivienda of viviendasEnCiudad) {
        for (const relacionCuadrilla of vivienda.cuadrillasTrabajando) {
            const cuadrilla = relacionCuadrilla.cuadrilla;
            const jefesRelacionados = await jefeCuadrillaLideraCuadrillaRepository.find({
                where: { codigoCuadrilla: cuadrilla.codigo },
                relations: {
                    jefeCuadrilla: {
                        usuario: true
                    }
                }
            });

            for (const relacionJefe of jefesRelacionados) {
                const jefe = relacionJefe.jefeCuadrilla;
                const datosUsuarioJefe = jefe.usuario;
                if (jefe && !listaVoluntariosAndJefes.some((v) => v.rut === datosUsuarioJefe.rut)) {
                    listaVoluntariosAndJefes.push({
                        rut: datosUsuarioJefe.rut,
                        nombreCompleto: `${datosUsuarioJefe.nombre} ${datosUsuarioJefe.primerApellido} ${datosUsuarioJefe.segundoApellido || ''}`.trim(),
                        telefonoEmergencia: datosUsuarioJefe.telefono || '',
                        cuadrilla: `Jefe de Cuadrilla ${cuadrilla.codigo}`
                    });
                }
            }
        }
    }
    return listaVoluntariosAndJefes;
};
const obtenerZonasDeDestino = (viviendasEnCiudad) => {
    return viviendasEnCiudad.map((vivienda) => ({
        codigoVivienda: vivienda.codigo,
        direccionDestino: vivienda.direccion,
        fechaInicio: vivienda.fechaInicioEstimada,
        fechaFin: vivienda.fechaFinEstimada,
    }));
};
export const generarDocumentoTransporte = async (data) => {

    const { codigoCiudad, trasladoPuntoOrigen } = data;

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
    const listaVoluntariosAndJefes = await obtenerListaVoluntariosAndJefeCuadrillasTransporte(viviendasEnCiudad);
    const destinos = obtenerZonasDeDestino(viviendasEnCiudad);

    const totalPasajeros = listaVoluntariosAndJefes.length;

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
        voluntarios: listaVoluntariosAndJefes // Lista detallada para el chofer
    };
};


// ALIMENTACION
const calcularDiasEstancia = (fechaInicio, fechaFin) => {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const milisegundos = 24 * 60 * 60 * 1000; // calculo de horas*minutos*segundos*milisegundos
    const milisegundosTranscurridos = Math.abs(inicio.getTime() - fin.getTime());
    const diasTranscurridos = Math.round(milisegundosTranscurridos / milisegundos);
    
    return diasTranscurridos;
};
const obtenerTotalVoluntariosActivosEnZona = (cuadrillaTrabaja, voluntariosActivos) => {

    const codigosCuadrillasZona = new Set(
        cuadrillaTrabaja.map((asignacion) => asignacion.codigoCuadrilla)
    );

    const rutsUnicos = new Set();

    // Recorrer los voluntarios activos del sistema
    for (const voluntario of voluntariosActivos) {
        const participaciones = voluntario.voluntariosParticipando || [];

        // Validamos que el voluntario pertenezca a alguna cuadrilla de la zona
        const participaEnZona = participaciones.some((participacion) =>
            codigosCuadrillasZona.has(participacion.codigoCuadrilla)
        );

        if (participaEnZona) rutsUnicos.add(voluntario.rutUsuario);
    }

    return rutsUnicos.size;
};
export const generarDocumentoProvisionAlimentos = async (data) => {
    const { codigoVivienda, rutEncargado } = data;
    const codigoViviendaNormalizado = String(codigoVivienda || '').trim();

    if (!codigoViviendaNormalizado) {
        throw new Error('Debe indicar un codigo de vivienda válido.');
    }

    const viviendaEncontrada = await viviendasRepository.findOneBy({ codigo: codigoViviendaNormalizado });

    if (!viviendaEncontrada) {
        console.log(`No se encontró la vivienda con código ${codigoViviendaNormalizado}`);
        throw new Error('La vivienda o zona de construcción especificada no existe.');
    }

    const fechaFinLogistica = viviendaEncontrada.fechaFinEstimada;
    // verificamos si la zona tiene una fecha asignada, este requisito es obligatorio para la racion de alimentos
    if (!viviendaEncontrada.fechaInicioEstimada || !fechaFinLogistica) {
        throw new Error('El sistema no permitirá generar la orden de raciones si la zona de construcción no tiene una fecha de término definida.');
    }

    // Obtener las cuadrillas de la zona
    const cuadrillaTrabaja = await cuadrillaTrabajaRepository.find({
        where: { codigoVivienda: codigoViviendaNormalizado }
    });

    if (!cuadrillaTrabaja || cuadrillaTrabaja.length === 0) {
        throw new Error('No hay cuadrillas asignadas a esta vivienda.');
    }

    // Obtener voluntarios activos en el sistema
    const voluntariosActivos = await voluntariosRepository.find({
        where: { estado: 'Activo' },
        relations: {
            voluntariosParticipando: true
        }
    });

    // llamamos la funcion obtenerTotalVoluntariosActivosEnZona
    const totalVoluntariosActivosEnZona = obtenerTotalVoluntariosActivosEnZona(cuadrillaTrabaja, voluntariosActivos);

    if (totalVoluntariosActivosEnZona === 0) {
        throw new Error('No se encontraron voluntarios activos asignados a las cuadrillas de esta zona.');
    }

    // Calcular la cantidad de dias de estancia
    const diasEstancia = calcularDiasEstancia(viviendaEncontrada.fechaInicioEstimada, fechaFinLogistica);

    // Determinar el volumen total de porciones necesarias (desayuno,almuerzo,cena) al dia
    const totalRaciones = totalVoluntariosActivosEnZona * diasEstancia * 3;

    // Retornamos la estructura del documento para el pedido de insumos
    return {
        documentoTipo: "PEDIDO_OFICIAL_INSUMOS_ALIMENTACION",
        fechaGeneracion: new Date(), // generar una fecha para el documento
        detalleZona: {
            codigoVivienda: viviendaEncontrada.codigo,
            descripcion: viviendaEncontrada.direccion,
            diasEstancia
        },
        calculoLogistico: {
            voluntariosActivos: totalVoluntariosActivosEnZona,
            racionesPorPersonaAlDia: 3,
            totalRacionesDeterminadas: totalRaciones // Atributo calculado solicitado
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
