import { AppDataSource } from "../config/configDb.js";
import { IsNull } from "typeorm";
import Herramienta from "../entities/herramientas.entity.js";
import InventarioJornada from "../entities/inventarioJornada.entity.js";
import CoberturaHerramienta from "../entities/coberturaHerramienta.entity.js";
import VoluntarioParticipaEnCuadrilla from "../entities/voluntarioParticipaEnCuadrilla.entity.js";
import ValidacionDespliegueHerramienta from "../entities/validacionDespliegueHerramienta.entity.js";

// ============================================================
// SERVICIOS CRUD DE HERRAMIENTAS
// ============================================================

// ALL
export async function getHerramientasService() {
  const herramientaRepository = AppDataSource.getRepository(Herramienta);
  return await herramientaRepository.find();
}

// ESPECIFICO
export async function getHerramientaByCodigoService(codigo) {
  const herramientaRepository = AppDataSource.getRepository(Herramienta);
  const herramienta = await herramientaRepository.findOne({
    where: { codigo },
  });

  if (!herramienta) {
    throw new Error("Herramienta no encontrada");
  }

  return herramienta;
}

// EDITAR ESPECIFICO
export async function editHerramientaService(codigo, data) {
  const herramientaRepository = AppDataSource.getRepository(Herramienta);
  const { nombre, stock_digital } = data;
  const herramienta = await herramientaRepository.findOne({
    where: { codigo },
  });

  if (!herramienta) {
    throw new Error("Herramienta no encontrada");
  }

  if (nombre) herramienta.nombre = nombre;
  if (stock_digital) herramienta.stock_digital = stock_digital;

  const updatedHerramienta = await herramientaRepository.save(herramienta);

  return updatedHerramienta;
}

// ELIMINAR ESPECIFICO
export async function deleteHerramientaService(codigo) {
  const herramientaRepository = AppDataSource.getRepository(Herramienta);
  const herramienta = await herramientaRepository.findOne({ where: { codigo } });

  if (!herramienta) return false;

  await herramientaRepository.remove(herramienta);
  return true;
}

export async function validarSuficienciaHerramientasService(codigoCuadrilla, codigoVivienda, herramientasSolicitadas, rutCentral) {
    const codigoCuadrillaNumero = Number(codigoCuadrilla);
    const codigoViviendaTexto = String(codigoVivienda || '').trim();

    if (!Number.isInteger(codigoCuadrillaNumero) || codigoCuadrillaNumero <= 0) {
        throw new Error("El codigo de cuadrilla debe ser un número entero positivo.");
    }
    if (!codigoViviendaTexto) {
        throw new Error("El codigo de vivienda es obligatorio.");
    }

    const participacionRepository = AppDataSource.getRepository(VoluntarioParticipaEnCuadrilla);
    const coberturaRepository = AppDataSource.getRepository(CoberturaHerramienta);
    const validacionRepository = AppDataSource.getRepository(ValidacionDespliegueHerramienta);

    const voluntariosActivos = await participacionRepository.count({
        where: {
            codigoCuadrilla: codigoCuadrillaNumero,
            fechaFin: IsNull(),
        },
    });

    if (voluntariosActivos === 0) {
        throw new Error("La cuadrilla no tiene voluntarios activos inscritos.");
    }

    const cantidadesSolicitadas = herramientasSolicitadas.reduce((acumulado, item) => {
        const idHerramienta = Number(item.id_herramienta);
        const cantidadActual = acumulado.get(idHerramienta) || 0;
        acumulado.set(idHerramienta, cantidadActual + Number(item.cantidad_asignada));
        return acumulado;
    }, new Map());

    const detalles = [];

    for (const [idHerramienta, cantidadAsignada] of cantidadesSolicitadas.entries()) {
        const cobertura = await coberturaRepository.findOne({
            where: { herramienta: { id: idHerramienta } },
            relations: { herramienta: true },
        });

        if (!cobertura) {
            throw new Error(`No existe configuración de cobertura para la herramienta ID ${idHerramienta}.`);
        }

        const personasPorUnidad = Number(cobertura.personas_cubiertas_por_unidad) || 1;
        const cantidadRequerida = Math.ceil(voluntariosActivos / personasPorUnidad);
        const deficitPorCobertura = Math.max(cantidadRequerida - cantidadAsignada, 0);
        const esSuficiente = deficitPorCobertura === 0;

        detalles.push({
            id_herramienta: idHerramienta,
            nombre_herramienta: cobertura.nombre_herramienta,
            orden_inscripcion: cobertura.orden_inscripcion,
            voluntarios_activos: voluntariosActivos,
            personas_cubiertas_por_unidad: personasPorUnidad,
            cantidad_requerida: cantidadRequerida,
            cantidad_asignada: cantidadAsignada,
            deficit_cobertura: deficitPorCobertura,
            suficiente: esSuficiente,
        });
    }

    const itemsConDeficit = detalles.filter((detalle) => !detalle.suficiente);

    const resultado = {
        codigoCuadrilla: codigoCuadrillaNumero,
        codigoVivienda: codigoViviendaTexto,
        voluntariosActivos,
        puedeAsignarse: itemsConDeficit.length === 0,
        mensaje: itemsConDeficit.length === 0
            ? "Las herramientas son suficientes para la cuadrilla."
            : "Asignación bloqueada: existe déficit de herramientas para la cuadrilla.",
        detalle: detalles,
        alertas: itemsConDeficit,
    };

    const validacionActiva = await validacionRepository.findOne({
        where: {
            codigoCuadrilla: codigoCuadrillaNumero,
            codigoVivienda: codigoViviendaTexto,
            utilizada: false,
        },
        order: { fechaValidacion: 'DESC' }
    });

    const registro = validacionActiva || validacionRepository.create({
        codigoCuadrilla: codigoCuadrillaNumero,
        codigoVivienda: codigoViviendaTexto,
    });

    registro.estado = resultado.puedeAsignarse ? 'APROBADO' : 'BLOQUEADO';
    registro.alertaDetalle = resultado.alertas.length > 0 ? JSON.stringify(resultado.alertas) : null;
    registro.rutCentral = rutCentral || null;
    registro.utilizada = false;

    await validacionRepository.save(registro);

    return resultado;
}

// ============================================================
// SERVICIOS DE JORNADA
// ============================================================

/**
 * PASO 1: Jefe de Cuadrilla confirma recepción de herramientas autorizadas por Central
 * Fija el stock_inicial que se llevará a la jornada
 */
export async function confirmarRecepcionService(idJornada, codigoCuadrilla, herramientasAutorizadas, rutJefe) {
    const jornadaRepository = AppDataSource.getRepository('Jornada');
    const cuadrillaRepository = AppDataSource.getRepository('Cuadrilla');
    const herramientaRepository = AppDataSource.getRepository(Herramienta);
    const inventarioRepository = AppDataSource.getRepository(InventarioJornada);
    const asignacionRepository = AppDataSource.getRepository('CuadrillaTrabajaEnVivienda');
    const validacionRepository = AppDataSource.getRepository(ValidacionDespliegueHerramienta);

    // 1. Validar jornada existe y cargar la vivienda relacionada
    const jornada = await jornadaRepository.findOne({ 
        where: { id: idJornada },
        relations: { vivienda: true }
    });
    if (!jornada) throw new Error('Jornada no encontrada.');
    if (jornada.estado === 'Finalizada') throw new Error('No se puede modificar una jornada finalizada.');
    
    // Extraer codigo_vivienda de la jornada (no del request)
    const codigoVivienda = jornada.vivienda?.codigo;
    if (!codigoVivienda) throw new Error('La jornada no tiene una vivienda asociada.');

    // 2. Validar cuadrilla existe
    const cuadrilla = await cuadrillaRepository.findOne({ where: { codigo: codigoCuadrilla } });
    if (!cuadrilla) throw new Error('Cuadrilla no encontrada.');

    // 3. Validar que cuadrilla está asignada a esta vivienda (sin terminar)
    const asignacion = await asignacionRepository.findOne({
        where: { 
            codigoCuadrilla: codigoCuadrilla,
            codigoVivienda: codigoVivienda,
            fechaFin: IsNull()
        }
    });
    if (!asignacion) throw new Error('Esta cuadrilla no está asignada a esta vivienda o la asignación ya finalizó.');

    const validacionPrevia = await validacionRepository.findOne({
        where: {
            codigoCuadrilla: codigoCuadrilla,
            codigoVivienda: codigoVivienda,
            utilizada: false,
        },
        order: { fechaValidacion: 'DESC' }
    });

    if (!validacionPrevia) {
        throw new Error('No existe validación previa de herramientas para este despliegue. Central debe validar antes del setup.');
    }

    if (validacionPrevia.estado !== 'APROBADO') {
        throw new Error('El despliegue está bloqueado por déficit de herramientas. Central debe corregir y revalidar.');
    }

    // 3.5. LIMPIAR REGISTROS VIEJOS DE ESTA JORNADA (si existen del seed o anterior confirmación)
    await inventarioRepository.delete({ jornada: { id: jornada.id } });

    // 4. Registrar cada herramienta con cantidad_inicial confirmada
    for (const item of herramientasAutorizadas) {
        const herramientaDB = await herramientaRepository.findOne({ 
            where: { id: item.id_herramienta } 
        });
        if (!herramientaDB) throw new Error(`Herramienta ID ${item.id_herramienta} no existe.`);

        const nuevoRegistro = inventarioRepository.create({
            codigo_vivienda: codigoVivienda,
            codigoCuadrilla: codigoCuadrilla,
            rutJefeQueRealizoSetup: rutJefe,
            cantidad_inicial: item.cantidad_inicial,
            estado_cierre: 'ACTIVO',
            jornada: { id: jornada.id },
            herramienta: { id: herramientaDB.id }
        });
        await inventarioRepository.save(nuevoRegistro);
    }

    validacionPrevia.estado = 'CONSUMIDO';
    validacionPrevia.utilizada = true;
    await validacionRepository.save(validacionPrevia);

    return { 
        mensaje: 'Recepción de herramientas confirmada. Stock inicial fijado.',
        codigoCuadrilla,
        jornadaId: idJornada
    };
}

/**
 * PASO 2: Jefe de Cuadrilla finaliza jornada con conteo físico y validaciones técnicas
 * Si hay descuadre: BLOQUEA hasta autorización de Central
 * Si sin descuadre: CIERRA automaticamente
 */
export async function finalizarJornadaService(idJornada, herramientasContadas, montajeEstructural, habilidadTecnica, conexionesBasicas, observaciones, rutJefe) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const jornadaRepository = queryRunner.manager.getRepository('Jornada');
        const inventarioRepository = queryRunner.manager.getRepository(InventarioJornada);
        const validacionRepository = queryRunner.manager.getRepository('JornadaValidacion');
        const asignacionRepository = queryRunner.manager.getRepository('CuadrillaTrabajaEnVivienda');
        const tareasRepository = queryRunner.manager.getRepository('TareasValidacionJornada');

        // 1. Obtener jornada
        const jornada = await jornadaRepository.findOne({ 
            where: { id: idJornada },
            relations: { vivienda: true }
        });
        if (!jornada) throw new Error('Jornada no encontrada.');
        if (jornada.estado === 'Finalizada') throw new Error('La jornada ya fue finalizada anteriormente.');

        // 1.5. VALIDAR QUE EXISTA VALIDACIÓN TÉCNICA CONFIRMADA
        const tareasConfirmadas = await tareasRepository.find({
            where: { jornada: { id: idJornada }, confirmado: true }
        });
        if (tareasConfirmadas.length === 0) {
            throw new Error('Debes completar y confirmar la validación técnica antes de finalizar la jornada.');
        }

        // 2. Crear registro de validaciones técnicas (por jornada, no por vivienda)
        const validacion = validacionRepository.create({
            montajeEstructural,
            habilidadTecnica,
            conexionesBasicas,
            observaciones: observaciones || null,
            jornada: { id: jornada.id }
        });
        await validacionRepository.save(validacion);

        // 3. Validar que todas las validaciones técnicas sean true
        if (!montajeEstructural || !habilidadTecnica || !conexionesBasicas) {
            throw new Error('Validación técnica incompleta. Todas las validaciones deben ser true para finalizar.');
        }

        // 4. Conteo y cruce físico vs digital
        let hayDescuadre = false;
        const detallesDescuadre = [];

        for (const item of herramientasContadas) {
            const registroDigital = await inventarioRepository.findOne({
                where: { 
                    jornada: { id: jornada.id }, 
                    herramienta: { id: item.id_herramienta } 
                },
                relations: { herramienta: true }
            });

            if (!registroDigital) throw new Error(`No hay registro inicial para herramienta ID ${item.id_herramienta}`);

            const herramientaGlobal = registroDigital.herramienta;
            const diferencia = registroDigital.cantidad_inicial - item.cantidad_fisica_final;

            if (diferencia > 0) {
                // Hay pérdida o daño
                hayDescuadre = true;
                
                if (!item.incidencia || item.incidencia.trim() === '') {
                    throw new Error(
                        `Stock no coincide. Faltan ${diferencia} unidad(es) de ${herramientaGlobal.nombre}. ` +
                        `Requiere ingresar incidencia (explicación del faltante).`
                    );
                }

                detallesDescuadre.push({
                    herramienta: herramientaGlobal.nombre,
                    cantidad_faltante: diferencia,
                    incidencia: item.incidencia
                });
            } else if (diferencia < 0) {
                throw new Error(
                    `Error: Se intenta devolver más unidades de ${herramientaGlobal.nombre} ` +
                    `que las registradas inicialmente.`
                );
            }

            // Registrar conteo final y quién lo validó
            registroDigital.cantidad_fisica_final = item.cantidad_fisica_final;
            registroDigital.incidencia = item.incidencia || null;
            registroDigital.rutJefeQueRealizoConteo = rutJefe;
            
            // Si hay descuadre, BLOQUEAR. Si no, AUTORIZAR
            if (hayDescuadre) {
                registroDigital.estado_cierre = 'BLOQUEADO';
            } else {
                registroDigital.estado_cierre = 'AUTORIZADO';
            }

            await inventarioRepository.save(registroDigital);
        }

        // 5. Si hay descuadre: BLOQUEAR JORNADA (devolver 202, NO cerrar)
        if (hayDescuadre) {
            await queryRunner.commitTransaction();
            return {
                estado_respuesta: 'BLOQUEADO',
                httpStatus: 202,
                mensaje: 'Jornada bloqueada. Descuadre detectado. Pendiente aprobación de Central.',
                detalles_descuadre: detallesDescuadre,
                instruccion: 'Central debe autorizar el cierre con el comando: PATCH /autorizar-cierre'
            };
        }

        // 6. Si SIN descuadre: CERRAR JORNADA
        jornada.estado = 'Finalizada';
        await jornadaRepository.save(jornada);

        // 7. Cerrar asignación de cuadrilla
        const asignacionActiva = await asignacionRepository.findOne({
            where: { 
                codigoVivienda: jornada.vivienda.codigo, 
                fechaFin: IsNull() 
            }
        });

        if (asignacionActiva) {
            asignacionActiva.fechaFin = new Date();
            await asignacionRepository.save(asignacionActiva);
        }

        // 8. Confirmar transacción
        await queryRunner.commitTransaction();

        return { 
            estado_respuesta: 'CERRADA',
            httpStatus: 200,
            mensaje: 'Jornada finalizada exitosamente. Sin descuadres detectados.',
            jornadaId: idJornada,
            validacionesRegistradas: {
                montajeEstructural,
                habilidadTecnica,
                conexionesBasicas
            }
        };

    } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
    } finally {
        await queryRunner.release();
    }
}

/**
 * PASO 3 (Opcional): Central autoriza o rechaza el cierre si hay bloqueado
 * Solo se ejecuta si estado_cierre = 'BLOQUEADO'
 */
export async function autorizarCierreService(idJornada, autorizado, motivo, rutCentral) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const jornadaRepository = queryRunner.manager.getRepository('Jornada');
        const inventarioRepository = queryRunner.manager.getRepository(InventarioJornada);
        const asignacionRepository = queryRunner.manager.getRepository('CuadrillaTrabajaEnVivienda');

        // 1. Obtener jornada
        const jornada = await jornadaRepository.findOne({ 
            where: { id: idJornada },
            relations: { vivienda: true }
        });
        if (!jornada) throw new Error('Jornada no encontrada.');

        // 2. Obtener registros bloqueados de esta jornada
        const registrosBloqueados = await inventarioRepository.find({
            where: { 
                jornada: { id: jornada.id },
                estado_cierre: 'BLOQUEADO'
            }
        });

        if (registrosBloqueados.length === 0) {
            throw new Error('No hay registros bloqueados para esta jornada.');
        }

        // 3. Si autorizado = true: marcar como CERRADO y cerrar jornada
        if (autorizado) {
            for (const registro of registrosBloqueados) {
                registro.estado_cierre = 'CERRADO';
                registro.rutCentralQueAutorizo = rutCentral;
                registro.fechaAutorizacion = new Date();
                await inventarioRepository.save(registro);
            }

            jornada.estado = 'Finalizada';
            await jornadaRepository.save(jornada);

            // Cerrar asignación de cuadrilla
            const asignacionActiva = await asignacionRepository.findOne({
                where: { 
                    codigoVivienda: jornada.vivienda.codigo, 
                    fechaFin: IsNull() 
                }
            });

            if (asignacionActiva) {
                asignacionActiva.fechaFin = new Date();
                await asignacionRepository.save(asignacionActiva);
            }

            await queryRunner.commitTransaction();
            return {
                mensaje: 'Cierre autorizado por Central. Jornada cerrada.',
                jornadaId: idJornada,
                estadoFinal: 'CERRADA',
                rutCentralQueAutoriz: rutCentral,
                motivo_autorizacion: motivo || 'Sin especificar'
            };
        } else {
            // Si autorizado = false: devolver a estado RECHAZADO
            for (const registro of registrosBloqueados) {
                registro.estado_cierre = 'RECHAZADO';
                registro.rutCentralQueAutorizo = rutCentral;
                registro.fechaAutorizacion = new Date();
                await inventarioRepository.save(registro);
            }

            await queryRunner.commitTransaction();
            return {
                mensaje: 'Cierre rechazado por Central. Jornada sigue bloqueada.',
                jornadaId: idJornada,
                estadoFinal: 'RECHAZADO',
                rutCentralQueRechazo: rutCentral,
                motivo_rechazo: motivo || 'Sin especificar'
            };
        }

    } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
    } finally {
        await queryRunner.release();
    }
}

// ============================================================
// SERVICIOS DE TAREAS DE VALIDACIÓN JORNADA
// ============================================================

/**
 * Crear una nueva tarea de validación para la jornada
 */
export async function crearTareaValidacionService(idJornada, descripcion, observaciones, rutJefe) {
    const jornadaRepository = AppDataSource.getRepository('Jornada');
    const tareasRepository = AppDataSource.getRepository('TareasValidacionJornada');

    // 1. Validar jornada existe
    const jornada = await jornadaRepository.findOne({ where: { id: idJornada } });
    if (!jornada) throw new Error('Jornada no encontrada.');
    if (jornada.estado === 'Finalizada') throw new Error('No se pueden crear tareas en una jornada finalizada.');

    // 2. Crear la tarea
    const nuevaTarea = tareasRepository.create({
        descripcion,
        observaciones: observaciones || null,
        estado: 'PENDIENTE',
        confirmado: false,
        jornada: { id: idJornada }
    });

    const tareaGuardada = await tareasRepository.save(nuevaTarea);

    return {
        id: tareaGuardada.id,
        descripcion: tareaGuardada.descripcion,
        estado: tareaGuardada.estado,
        confirmado: tareaGuardada.confirmado,
        fecha_creada: tareaGuardada.fecha_creada
    };
}

/**
 * Obtener todas las tareas de una jornada
 */
export async function obtenerTareasValidacionService(idJornada) {
    const tareasRepository = AppDataSource.getRepository('TareasValidacionJornada');

    const tareas = await tareasRepository.find({
        where: { jornada: { id: idJornada } },
        order: { fecha_creada: 'ASC' }
    });

    return tareas;
}

/**
 * Obtener una tarea específica
 */
export async function obtenerTareaValidacionService(idTarea) {
    const tareasRepository = AppDataSource.getRepository('TareasValidacionJornada');

    const tarea = await tareasRepository.findOne({ where: { id: idTarea } });
    if (!tarea) throw new Error('Tarea no encontrada.');

    return tarea;
}

/**
 * Marcar o desmarcar una tarea (solo si no está confirmado)
 */
export async function marcarTareaValidacionService(idTarea, marcar, rutJefe) {
    const tareasRepository = AppDataSource.getRepository('TareasValidacionJornada');

    // 1. Obtener tarea
    const tarea = await tareasRepository.findOne({ where: { id: idTarea } });
    if (!tarea) throw new Error('Tarea no encontrada.');

    // 2. Validar que no esté confirmada (bloqueada)
    if (tarea.confirmado) {
        throw new Error('No se puede modificar una tarea confirmada. Contacta a tu supervisor.');
    }

    // 3. Marcar o desmarcar
    if (marcar) {
        tarea.estado = 'COMPLETADO';
        tarea.fecha_completado = new Date();
        tarea.rutJefeQueCompletó = rutJefe;
    } else {
        tarea.estado = 'PENDIENTE';
        tarea.fecha_completado = null;
        tarea.rutJefeQueCompletó = null;
    }

    const tareaActualizada = await tareasRepository.save(tarea);

    return {
        id: tareaActualizada.id,
        estado: tareaActualizada.estado,
        confirmado: tareaActualizada.confirmado,
        fecha_completado: tareaActualizada.fecha_completado
    };
}

/**
 * Confirmar validación técnica: valida que TODAS estén COMPLETADO y las bloquea
 */
export async function confirmarValidacionTecnicaService(idJornada, rutJefe) {
    const tareasRepository = AppDataSource.getRepository('TareasValidacionJornada');

    // 1. Obtener todas las tareas de la jornada
    const tareas = await tareasRepository.find({
        where: { jornada: { id: idJornada } }
    });

    // 2. Validar que existan tareas
    if (tareas.length === 0) {
        throw new Error('No hay tareas de validación creadas para esta jornada.');
    }

    // 3. Validar que todas estén COMPLETADO
    const tareasIncompletas = tareas.filter(t => t.estado !== 'COMPLETADO');
    if (tareasIncompletas.length > 0) {
        throw new Error(
            `No se puede confirmar validación técnica. Hay ${tareasIncompletas.length} tarea(s) pendiente(s) de completar.`
        );
    }

    // 4. Bloquear todas (marcar confirmado = true)
    for (const tarea of tareas) {
        tarea.confirmado = true;
        await tareasRepository.save(tarea);
    }

    return {
        mensaje: 'Validación técnica confirmada exitosamente.',
        tareas_confirmadas: tareas.length,
        jornadaId: idJornada
    };
}