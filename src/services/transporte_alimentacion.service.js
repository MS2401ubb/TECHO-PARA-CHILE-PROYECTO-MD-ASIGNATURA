const db = require('../config/db');

const viviendas = require('../entities/Vivienda.entity');
const viviendasRepository = db.getRepository(viviendas);


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
        relations: [
            'cuadrillasTrabajando',
            'cuadrillasTrabajando.cuadrilla',
            'cuadrillasTrabajando.cuadrilla.voluntariosParticipando',
            'cuadrillasTrabajando.cuadrilla.voluntariosParticipando.voluntario',
            'cuadrillasTrabajando.cuadrilla.voluntariosParticipando.voluntario.usuario'
        ]
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
        },
        destinos: destinos, // Lista de paradas/casas
        voluntarios: listaVoluntarios // Lista detallada para el chofer
    };
};

module.exports = {generarDocumentoTransporte};