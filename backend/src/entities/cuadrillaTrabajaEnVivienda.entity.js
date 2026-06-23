import { EntitySchema } from 'typeorm';

export default new EntitySchema({
  name: 'CuadrillaTrabajaEnVivienda',
  tableName: 'cuadrilla_trabaja_en_vivienda',
  columns: {
    codigoCuadrilla: {
      primary: true,
      type: 'int',
    },
    codigoVivienda: {
      primary: true,
      type: 'varchar',
      length: 50,
    },
    fechaInicio: {
      primary: true,
      type: 'date',
    },
    fechaFin: {
      type: 'date',
      nullable: true, // Permanece NULL mientras la obra siga en ejecución por esta cuadrilla
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