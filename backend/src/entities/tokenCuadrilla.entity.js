import boolean from 'joi';
import { EntitySchema } from 'typeorm';

/**
 * @typedef {Object} TokenType
 * @property {number} id
 * @property {string} valor
 * @property {Timestamp} creacion
 * @property {boolean} activo
 * @property {number} codigoCuadrilla
 */

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
            type: 'date',
            nullable: false,
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