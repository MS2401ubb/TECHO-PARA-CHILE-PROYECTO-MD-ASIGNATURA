import { AppDataSource } from "../config/configDb.js";
import User from "../entities/usuario.entity.js";
import bcrypt from "bcrypt";

const ROLES_VALIDOS = [
  "Voluntario",
  "Jefe de Cuadrilla",
  "Encargado de Voluntarios",
  "Encargado de Central",
  "admin",
];

// ALL
export async function getUsersService() {
  const userRepository = AppDataSource.getRepository(User);
  return await userRepository.find();
}
// ESPECIFICO
export async function getUserByRutService(rut) {
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOne({
    where: { rut },
  });

  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  return user;
}

// EDITAR ESPECIFICO
export async function editUserService(rut, data) {
  const userRepository = AppDataSource.getRepository(User);
  const { password, nombre, primerApellido, segundoApellido, fechaNacimiento, email, telefono, rol, codigoCiudad } = data;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await userRepository.findOne({
    where: { rut },
  });

  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  if (password) user.password = hashedPassword;
  if (nombre) user.nombre = nombre;
  if (primerApellido) user.primerApellido = primerApellido;
  if (segundoApellido) user.segundoApellido = segundoApellido;
  if (fechaNacimiento) user.fechaNacimiento = fechaNacimiento;
  if (email) user.email = email;
  if (telefono) user.telefono = telefono;
  if (rol) user.rol = rol;
  if (codigoCiudad) user.codigoCiudad = codigoCiudad;
  

  const updatedUser = await userRepository.save(user);
  delete updatedUser.password;

  return updatedUser;
}

// ELIMINAR ESPECIFICO
export async function deleteUserService(rut) {
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOne({ where: { rut } });

  if (!user) return false;

  await userRepository.remove(user);
  return true;
}

export async function asignarRolUsuarioService(rut, nuevoRol) {
  if (!ROLES_VALIDOS.includes(nuevoRol)) {
    throw new Error(`Rol inválido. Roles permitidos: ${ROLES_VALIDOS.join(", ")}`);
  }

  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOne({ where: { rut } });

  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  const rolAnterior = user.rol;
  user.rol = nuevoRol;
  const updatedUser = await userRepository.save(user);
  delete updatedUser.password;

  return {
    rut: updatedUser.rut,
    rolAnterior,
    rolNuevo: updatedUser.rol,
  };
}

export { ROLES_VALIDOS };