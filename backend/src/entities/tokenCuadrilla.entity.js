import { boolean } from 'joi';
import { EntitySchema } from 'typeorm';

export default new EntitySchema({
    name: 'TokenAsignacionCuadrilla',
    tableName: 'token_asignacion_cuadrilla',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true
        },
        valorToken: {
            type: 'varchar',
            length: 10
        },
        fechaCreacion: {
            type: 'timestamp',
            default: () => 'CURRENT_TIMESTAMP'
        },
        activo: {
            type: 'boolean',
            default: true
        },
        codigoCuadrilla:{
            type: 'int',
            nullable: false
        },
    },
    relations: {
        cuadrilla: {
            target: 'Cuadrilla',
            type: 'many-to-one',
            joinColumn: { name: 'codigoCuadrilla' },
            onDelete: 'CASCADE',
        },
        voluntariosAsociados: {
            target: 'Voluntario',
            type: 'one-to-many',
            inverseSide: 'tokenIngresado'
        }
    },
    indices: [{
        name: 'IDX_TokenCuadrilla_Valor_Activo_UNIQ',
        columns: ['valorToken'],
        unique: true,
        where: 'activo = true' //unicidad importa solo si token esta activo (entre distintas cuadrillas o la misma).
    }]
}); 