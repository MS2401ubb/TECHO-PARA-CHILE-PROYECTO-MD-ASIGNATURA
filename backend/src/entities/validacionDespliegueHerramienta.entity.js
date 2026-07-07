import { EntitySchema } from 'typeorm';

export default new EntitySchema({
  name: 'ValidacionDespliegueHerramienta',
  tableName: 'validacion_despliegue_herramientas',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    codigoCuadrilla: {
      type: 'int',
      nullable: false,
    },
    codigoVivienda: {
      type: 'varchar',
      length: 50,
      nullable: false,
    },
    estado: {
      type: 'enum',
      enum: ['APROBADO', 'BLOQUEADO', 'CONSUMIDO'],
      default: 'BLOQUEADO',
    },
    alertaDetalle: {
      type: 'text',
      nullable: true,
    },
    rutCentral: {
      type: 'varchar',
      length: 15,
      nullable: true,
    },
    fechaValidacion: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
    },
    utilizada: {
      type: 'boolean',
      default: false,
    },
  },
  relations: {
    cuadrilla: {
      target: 'Cuadrilla',
      type: 'many-to-one',
      joinColumn: { name: 'codigoCuadrilla' },
      onDelete: 'CASCADE',
    },
    vivienda: {
      target: 'Vivienda',
      type: 'many-to-one',
      joinColumn: { name: 'codigoVivienda' },
      onDelete: 'CASCADE',
    },
  },
});