import { EntitySchema } from 'typeorm';

export default new EntitySchema({
  name: 'Usuario',
  tableName: 'usuarios',
  columns: {
    rut: {
      primary: true,
      type: 'varchar',
      length: 15,
      nullable: false,
    },
    password: {
      type: 'varchar',
      length: 100,
      nullable: false,
    },
    nombre: {
      type: 'varchar',
      length: 100,
      nullable: false,
    },
    primerApellido: {
      type: 'varchar',
      length: 100,
      nullable: false,
    },
    rol: {
      type: 'varchar',
      length: 50,
      nullable: false, //   "Voluntario Espontáneo","Voluntario General", "Jefe de Cuadrilla", "Encargado de Voluntarios", "Encargado de Central", "admin"
    },
    telefono: {
      type: 'varchar',
      length: 20,
      nullable: false,
    },
    // ==========================================
    // CAMPOS CONDICIONALES (NULLABLE A NIVEL BD)
    // ==========================================
    segundoApellido: {
      type: 'varchar',
      length: 100,
      nullable: true, 
    },
    fechaNacimiento: {
      type: 'date',
      nullable: true,
    },
    email: {
      type: 'varchar',
      length: 200,
      nullable: true,
    },
    codigoCiudad: { 
      type: 'int',
      nullable: true,
    }
  },
  relations: {
    ciudad: {
      target: 'Ciudad',
      type: 'many-to-one',
      joinColumn: { name: 'codigoCiudad' },
      onDelete: 'RESTRICT',
    },
  },
});