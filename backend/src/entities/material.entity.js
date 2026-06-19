import { EntitySchema } from 'typeorm';

export default new EntitySchema({
    name: "Material",
    tableName: "materiales",
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
        tipo: {
            type: "enum",
            enum: ["Herramienta", "Material"],
            nullable: false
        },
        stock_digital: {
            type: "int",
            default: 0
        }
    }
});