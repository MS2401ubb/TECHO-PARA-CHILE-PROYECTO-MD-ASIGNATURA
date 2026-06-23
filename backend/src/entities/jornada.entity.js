import { EntitySchema } from 'typeorm';

export default new EntitySchema({
    name: "Jornada",
    tableName: "jornadas",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        fecha: {
            type: "date",
            nullable: false
        },
        estado: {
            type: "enum",
            enum: ["Activa", "Finalizada"],
            default: "Activa"
        }
    },
    relations: {
        // Relación con el Jefe de Cuadrilla (asumiendo que la entidad se llama JefeCuadrilla)
        jefeCuadrilla: {
            target: "JefeCuadrilla", 
            type: "many-to-one",
            joinColumn: { name: "rut_jefe" },
            onDelete: "RESTRICT"
        },
        // Relación con la Vivienda
        vivienda: {
            target: "Vivienda",
            type: "many-to-one",
            joinColumn: { name: "id_vivienda" },
            onDelete: "CASCADE"
        }
    }
});