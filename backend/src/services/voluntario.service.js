import { AppDataSource } from "../config/configDb.js";
import Voluntario from "../entities/voluntario.entity.js";


async function listarPorEstado(estado) {
  const voluntarioRepository = AppDataSource.getRepository(Voluntario);
  return voluntarioRepository.find({
    where: { estado },
  });
}
// GET VOLUNTARIOS POSTULANTES
export async function obtenerListaPostulantes() {
  return listarPorEstado('Postulante');
}
// GET VOLUNTARIOS ACTIVOS
export async function obtenerListaVoluntarios() {
  return listarPorEstado('Activo');
}

// GET VOLUNTARIO POR RUT
export async function obtenerVoluntarioPorRut(rut) {
    const voluntarioRepository = AppDataSource.getRepository(Voluntario);
    const voluntario = await voluntarioRepository.findOne({
        where: { usuario: { rut } },
    });
    if (!voluntario) {
        throw new Error('No se encontro un voluntario con el RUT indicado.');
    }

    return voluntario;
}
