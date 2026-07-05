import { BeforeInsert } from 'typeorm';
import AppDataSource from '../config/configDb.js';
import {Usuario} from '../entities/usuario.entity';

export const UsuarioSubscriber = {
  listenTo() {
    return 'Usuario'; // Nombre de la entidad a escuchar
  },

  beforeInsert(event) {
    const usuario = event.entity;
    validarCamposObligatoriosPorRol(usuario);
  },

  beforeUpdate(event) {
    const usuario = event.entity;
    validarCamposObligatoriosPorRol(usuario);
  }
};

/**
 * Aplica tu lógica condicional: si el rol NO contiene "Espontáneo", 
 * obliga a que los campos no sean nulos o vacíos.
 */
function validarCamposObligatoriosPorRol(usuario) {
  
  // 2. PRIMERA VALIDACIÓN: Verificar si el rol ingresado existe en la lista permitida
  if (!usuario.rol || !ROLES_VALIDOS.includes(usuario.rol)) {
    throw new Error(`El rol '${usuario.rol || 'Nulo'}' no es un rol válido en el sistema.`);
  }

  // 3. SEGUNDA VALIDACIÓN: Lógica condicional según el rol
  if (usuario.rol && !usuario.rol.includes("Espontáneo")) {
    
    // Lista de campos que NO deben ser nulos para el resto de los roles
    if (!usuario.segundoApellido || usuario.segundoApellido.trim() === "") {
      throw new Error(`El campo 'segundoApellido' es obligatorio para el rol ${usuario.rol}.`);
    }
    if (!usuario.fechaNacimiento) {
      throw new Error(`El campo 'fechaNacimiento' es obligatorio para el rol ${usuario.rol}.`);
    }
    if (!usuario.email || usuario.email.trim() === "") {
      throw new Error(`El campo 'email' es obligatorio para el rol ${usuario.rol}.`);
    }
    if (!usuario.codigoCiudad) {
      throw new Error(`El campo 'ciudad' (codigoCiudad) es obligatorio para el rol ${usuario.rol}.`);
    }
  }
}