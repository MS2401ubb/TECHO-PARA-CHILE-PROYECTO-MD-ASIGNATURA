import { EntitySchema } from 'typeorm';

export default new EntitySchema({
    name: "Herramienta",
    tableName: "herramientas",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        nombre: {
            type: "varchar",
            length: 100,
            nullable: false
        },
        stock_digital: {
            type: "int",
            default: 0
        }
    }
});