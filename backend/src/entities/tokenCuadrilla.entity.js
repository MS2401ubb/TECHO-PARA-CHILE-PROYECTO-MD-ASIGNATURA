import { boolean } from 'joi';
import { EntitySchema } from 'typeorm';

export default new EntitySchema({
    name: 'TokenAsignacionCuadrilla',
    tableName: 'token_asignacion_cuadrilla',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true,
        },
        valorToken: {
            type: 'varchar',
            length: 10,
            unique: true,
        },
        fechaCreacion: {
            type: 'timestamp',
            default: () => 'CURRENT_TIMESTAMP',
        },
        activo: {
            type: 'boolean',
            default: true,
        },
        codigoCuadrilla:{
            type: 'int',
        },
    },
    relations: {
        cuadrilla: {
            target: 'Cuadrilla',
            type: 'many-to-one',
            joinColumn: {name: 'codigoCuadrilla'},
            onDelete: 'CASCADE',
        },
    },
});