const { DataSource } = require('typeorm');
require('dotenv').config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true, // Crea y actualiza las tablas automáticamente en base a tus entities
  logging: true,  // Muestra las consultas SQL en la consola
  entities: [
    // Entidades base de tus compañeros (agrega las demás que tengan)
    require('../entities/Vivienda'),
    require('../entities/CuadrillaTrabajaEnVivienda'),
    require('../entities/Ciudad'),
    require('../entities/Cuadrilla'),
    require('../entities/EncargadoCentral'),
    require('../entities/EncargadoVoluntarios'),
    require('../entities/JefeCuadrilla'),
    require('../entities/Region'),
    require('../entities/Usuario'),
    require('../entities/Voluntario'),
    require('../entities/VoluntarioParticipaEnCuadrilla'),
    require('../entities/Material'),
    require('../entities/Jornada'),
    require('../entities/InventarioJornada')
  ],
});

module.exports = { AppDataSource };