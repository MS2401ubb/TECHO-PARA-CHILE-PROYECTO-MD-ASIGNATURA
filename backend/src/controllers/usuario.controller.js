import {
  getUsersService,
  getJefesCuadrillaService,
  getUserByRutService,
  editUserService,
  deleteUserService,
  asignarRolUsuarioService,
} from "../services/usuario.service.js";
import { editUserBodyValidation, assignRoleBodyValidation } from "../validations/usuario.validation.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

export async function getUsers(req, res) {
  try {
    const users = await getUsersService();

    if (users.length < 1) {
      handleSuccess(res, 200, "No hay usuarios registrados");
    }

    handleSuccess(res, 200, "Usuarios obtenidos exitosamente", users);
  } catch (error) {
    handleErrorServer(res, 500, "Error al obtener usuarios", error.message);
  }
}

export async function getJefesCuadrilla(req, res) {
  try {
    const jefes = await getJefesCuadrillaService();

    if (jefes.length < 1) {
      return handleSuccess(res, 200, "No hay jefes de cuadrilla registrados", []);
    }

    return handleSuccess(res, 200, "Jefes de cuadrilla obtenidos exitosamente", jefes);
  } catch (error) {
    return handleErrorServer(res, 500, "Error al obtener jefes de cuadrilla", error.message);
  }
}

export async function getUserByRut(req, res) {
  try {
    const { rut } = req.params;
    const user = await getUserByRutService(rut);

    handleSuccess(res, 200, "Usuario encontrado", user);
  } catch (error) {
    if (error.message === "Usuario no encontrado") {
      handleErrorClient(res, 404, error.message);
    } else {
      handleErrorServer(res, 500, "Error al obtener el usuario", error.message);
    }
  }
}

export async function editUser(req, res) {
  try {
    const { rut } = req.params;
    const { body } = req;

    if (!body) return handleErrorClient(res, 400, "Debe especificar al menos 1 parámetro");

    const { error } = editUserBodyValidation.validate(body);

    if (error) return handleErrorClient(res, 400, "Parámetros inválidos", error.message);

    const updatedUser = await editUserService(rut, body);

    handleSuccess(res, 200, "Usuario actualizado exitosamente", updatedUser);
  } catch (error) {
    if (error.message === "Usuario no encontrado") {
      return handleErrorClient(res, 404, error.message);
    }

    if (error.code === "23505") {
      if (error.detail?.includes("rut")) {
        return handleErrorClient(res, 409, "El RUT ya está registrado");
      }
      return handleErrorClient(res, 409, "Ya existe un usuario con estos datos");
    } else {
      return handleErrorServer(res, 500, "Error interno del servidor", error.message);
    }
  }
}

export async function deleteUser(req, res) {
  try {
    const { rut } = req.params;
    const result = await deleteUserService(rut);

    if (!result) return handleErrorClient(res, 404, "Usuario no encontrado");

    handleSuccess(res, 200, "Usuario eliminado exitosamente");
  } catch (error) {
    handleErrorServer(res, 500, "Error al eliminar usuario", error.message);
  }
}

export async function asignarRolUsuario(req, res) {
  try {
    const { rut } = req.params;
    const { body } = req;

    const { error, value } = assignRoleBodyValidation.validate(body);
    if (error) return handleErrorClient(res, 400, "Parámetros inválidos", error.message);

    const data = await asignarRolUsuarioService(rut, value.rol);
    return handleSuccess(res, 200, "Rol de usuario actualizado exitosamente", data);
  } catch (error) {
    if (error.message === "Usuario no encontrado") {
      return handleErrorClient(res, 404, error.message);
    }
    if (error.message.startsWith("Rol inválido")) {
      return handleErrorClient(res, 400, error.message);
    }
    return handleErrorServer(res, 500, "Error al actualizar rol de usuario", error.message);
  }
}
