import { EntitySchema } from 'typeorm';

export default new EntitySchema({
  name: 'CoberturaHerramienta',
  tableName: 'cobertura_herramientas',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    nombre_herramienta: {
      type: 'varchar',
      length: 100,
      nullable: false,
    },
    orden_inscripcion: {
      type: 'int',
      nullable: false,
      unique: true,
    },
    personas_cubiertas_por_unidad: {
      type: 'int',
      nullable: false,
      default: 1,
    },
  },
  relations: {
    herramienta: {
      target: 'Herramienta',
      type: 'many-to-one',
      joinColumn: { name: 'id_herramienta' },
      onDelete: 'CASCADE',
    },
  },
});