const { DataSource } = require('typeorm');
require('dotenv').config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [
    // Entidades
    require('../entities/Vivienda.entity'),
    require('../entities/CuadrillaTrabajaEnVivienda.entity'),
    require('../entities/Ciudad.entity'),
    require('../entities/Cuadrilla.entity'),
    require('../entities/EncargadoCentral.entity'),
    require('../entities/EncargadoVoluntarios.entity'),
    require('../entities/JefeCuadrilla.entity'),
    require('../entities/Region.entity'),
    require('../entities/Usuario.entity'),
    require('../entities/Voluntario.entity'),
    require('../entities/VoluntarioParticipaEnCuadrilla.entity')
  ],
});

module.exports = AppDataSource;