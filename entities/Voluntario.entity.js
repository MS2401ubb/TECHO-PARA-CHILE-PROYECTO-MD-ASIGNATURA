const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Voluntario',
  tableName: 'voluntarios',
  columns: {
    rutUsuario: {
      primary: true,
      type: 'varchar',
      length: 20,
    },
    tipo: {
      type: 'varchar',
      length: 50, // 'General' o 'Espontáneo'
    },
    estado: {
      type: 'varchar',
      length: 50,
      nullable: true,
    },
    solicitudActiva: {
      type: 'boolean',
      default: false,
    },
    fechaValidacionDatos: {
      type: 'date',
      nullable: true,
    },
    fechaActivacionSolicitud: {
      type: 'date',
      nullable: true,
    },
    telefonoEmergencia: {
      type: 'varchar',
      length: 20,
      nullable: true,
    },
  },
  relations: {
    usuario: {
      target: 'Usuario',
      type: 'one-to-one',
      joinColumn: { name: 'rutUsuario' },
      onDelete: 'CASCADE',
    },
  },
});