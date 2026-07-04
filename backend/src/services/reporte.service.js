import { AppDataSource } from "../config/configDb.js";
import Reporte from "../entities/reporte.entity.js";

export async function crearReporteService(data, rutRemitente) {
  const reporteRepository = AppDataSource.getRepository(Reporte);
  const usuarioRepository = AppDataSource.getRepository("Usuario");

  const remitente = await usuarioRepository.findOne({ where: { rut: rutRemitente } });
  if (!remitente) {
    throw new Error("Remitente no encontrado.");
  }

  const reporte = reporteRepository.create({
    titulo: data.titulo.trim(),
    contenido: data.contenido.trim(),
    areaOrganizacion: data.areaOrganizacion,
    urgencia: data.urgencia,
    categoria: data.categoria,
    periodo: data.periodo?.trim() || null,
    estado: "Recibido",
    remitente: { rut: rutRemitente },
  });

  const nuevoReporte = await reporteRepository.save(reporte);
  return obtenerReportePorIdService(nuevoReporte.id);
}

export async function listarReportesService(filtros = {}) {
  const reporteRepository = AppDataSource.getRepository(Reporte);
  const where = {};

  if (filtros.areaOrganizacion) where.areaOrganizacion = filtros.areaOrganizacion;
  if (filtros.urgencia) where.urgencia = filtros.urgencia;
  if (filtros.categoria) where.categoria = filtros.categoria;
  if (filtros.estado) where.estado = filtros.estado;

  return reporteRepository.find({
    where,
    relations: { remitente: true },
    order: { fechaEnvio: "DESC" },
  });
}

export async function obtenerReportePorIdService(id) {
  const reporteRepository = AppDataSource.getRepository(Reporte);
  const idReporte = Number(id);

  if (!Number.isInteger(idReporte) || idReporte <= 0) {
    throw new Error("El id del reporte debe ser un número entero positivo.");
  }

  const reporte = await reporteRepository.findOne({
    where: { id: idReporte },
    relations: { remitente: true },
  });

  if (!reporte) {
    throw new Error("Reporte no encontrado.");
  }

  return reporte;
}

export async function actualizarEstadoReporteService(id, estado) {
  const reporteRepository = AppDataSource.getRepository(Reporte);
  const reporte = await obtenerReportePorIdService(id);

  reporte.estado = estado;
  await reporteRepository.save(reporte);

  return obtenerReportePorIdService(reporte.id);
}

