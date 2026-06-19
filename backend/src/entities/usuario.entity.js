import { EntitySchema } from 'typeorm';

export default new EntitySchema({
    name: 'Usuario',
    tableName: 'usuarios',
    columns: {
        rut: {
            primary: true,
            type: 'varchar',
            length: 15,
            nullable: false,
        },
        password:{
            type: 'varchar',
            length: 100,
            nullable: false,
        },
        nombre:{
            type: 'varchar',
            length: 100,
            nullable: false,
        },
        primerApellido:{
            type: 'varchar',
            length: 100,
            nullable: false,
        },
        segundoApellido:{
            type: 'varchar',
            length: 100,
            nullable: false,
        },
        fechaNacimiento:{
            type: 'date',
        },
        email:{
            type: 'varchar',
            length: 200,
        },
        telefono:{
            type: 'varchar',
            length: 20,
        },
        rol:{
            type:'varchar',
            length: 50,
            nullable: false,
        },
    },
    relations: {
        ciudad: {
            target: 'Ciudad',
            type: 'many-to-one',
            joinColumn:{ name: 'codigoCiudad'},
            onDelete: 'RESTRICT',
        },
    },
});