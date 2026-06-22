import { EntitySchema } from 'typeorm';

export default new EntitySchema({
  name: 'JefeCuadrillaLideraCuadrilla',
  tableName: 'jefe_cuadrilla_lidera_cuadrilla',
  columns: {
    rutJefeCuadrilla: {
      primary: true,
      type: 'varchar',
      length: 20,
    },
    codigoCuadrilla: {
      primary: true,
      type: 'int',
    },
    fechaInicio: {
      primary: true,
      type: 'date',
    },
    fechaFin: {
      type: 'date',
      nullable: true, // Permanece NULL mientras el jefe de cuadrilla siga liderando de forma activa
    },
  },
  relations: {
    jefeCuadrilla: {
      target: 'JefeCuadrilla',
      type: 'many-to-one',
      joinColumn: { name: 'rutJefeCuadrilla' },
      onDelete: 'CASCADE',
    },
    cuadrilla: {
      target: 'Cuadrilla', 
      type: 'many-to-one',
      joinColumn: { name: 'codigoCuadrilla' },
      onDelete: 'CASCADE',
    },
  },
});