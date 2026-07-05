import { EntitySchema } from "typeorm";

export default new EntitySchema({
    name: "InventarioJornada",
    tableName: "inventario_jornadas",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        fecha: {
            type: "date",
            default: () => "CURRENT_DATE"
        },
        codigo_vivienda: {
            type: "varchar",
            length: 50,
            nullable: true
        },
        cantidad_inicial: {
            type: "int",
            nullable: false
        },
        cantidad_fisica_final: {
            type: "int",
            nullable: true
        },
        incidencia: {
            type: "text",
            nullable: true
        },
        codigoCuadrilla: {
            type: "int",
            nullable: false
        },
        rutJefeQueRealizoSetup: {
            type: "varchar",
            length: 15,
            nullable: false
        },
        rutJefeQueRealizoConteo: {
            type: "varchar",
            length: 15,
            nullable: true
        },
        estado_cierre: {
            type: "enum",
            enum: ["ACTIVO", "BLOQUEADO", "AUTORIZADO", "CERRADO"],
            default: "ACTIVO"
        },
        rutCentralQueAutorizo: {
            type: "varchar",
            length: 15,
            nullable: true
        },
        fechaAutorizacion: {
            type: "timestamp",
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
        herramienta: {
            target: "Herramienta",
            type: "many-to-one",
            joinColumn: { name: "id_herramienta" },
            onDelete: "RESTRICT"
        },
        cuadrilla: {
            target: "Cuadrilla",
            type: "many-to-one",
            joinColumn: { name: "codigoCuadrilla" },
            onDelete: "RESTRICT"
        }
    }
});