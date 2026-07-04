"use strict";
import { DataSource } from 'typeorm';

import Vivienda from '../entities/vivienda.entity.js';
import CuadrillaTrabajaEnVivienda from '../entities/cuadrillaTrabajaEnVivienda.entity.js';
import Ciudad from '../entities/ciudad.entity.js';
import Cuadrilla from '../entities/cuadrilla.entity.js';
import EncargadoCentral from '../entities/encargadoCentral.entity.js';
import EncargadoVoluntarios from '../entities/encargadoVoluntarios.entity.js';
import JefeCuadrilla from '../entities/jefeCuadrilla.entity.js';
import Region from '../entities/region.entity.js';
import Usuario from '../entities/usuario.entity.js';
import Voluntario from '../entities/voluntario.entity.js';
import VoluntarioParticipaEnCuadrilla from '../entities/voluntarioParticipaEnCuadrilla.entity.js';
import Material from '../entities/material.entity.js';
import Jornada from '../entities/jornada.entity.js';
import InventarioJornada from '../entities/inventarioJornada.entity.js';
import JefeCuadrillaLideraCuadrilla from '../entities/jefeCuadrillaLideraCuadrilla.entity.js';
import TokenAsignaCuadrilla from '../entities/tokenCuadrilla.entity.js';

import { UsuarioSubscriber } from '../utils/usuario.subscriber.js';
import Reporte from '../entities/reporte.entity.js';

import { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } from './configEnv.js';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  synchronize: true,
  logging: false,
  entities: [
    //Entidades
    Vivienda,
    CuadrillaTrabajaEnVivienda,
    Ciudad,
    Cuadrilla,
    EncargadoCentral,
    EncargadoVoluntarios,
    JefeCuadrilla,
    Region,
    Usuario,
    Voluntario,
    VoluntarioParticipaEnCuadrilla,
    Material,
    Jornada,
    InventarioJornada,
    JefeCuadrillaLideraCuadrilla,
    TokenAsignaCuadrilla,
    Reporte
  ],
  subscribers:[ UsuarioSubscriber],
});

export { AppDataSource };
export default AppDataSource;
