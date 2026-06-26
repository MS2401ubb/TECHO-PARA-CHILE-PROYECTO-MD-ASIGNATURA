const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "InventarioJornada",
    tableName: "inventario_jornadas",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        cantidad_fisica: {
            type: "int",
            nullable: false
        },
        incidencia: {
            type: "text",
            nullable: true
        }
    },
    relations: {
        jornada: {
            target: "Jornada",
            type: "many-to-one",
            joinColumn: { name: "id_jornada" },
            onDelete: "CASCADE"
        },
        material: {
            target: "Material",
            type: "many-to-one",
            joinColumn: { name: "id_material" },
            onDelete: "RESTRICT"
        }
    }
});