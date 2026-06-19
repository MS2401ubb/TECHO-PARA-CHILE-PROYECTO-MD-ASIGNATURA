"use strict";
import { fileURLToPath } from "url";
import path from "path";
import dotenv from 'dotenv';
// Configuración para que sepa dónde estan las variables de entorno
const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);
const envFilePath = path.resolve(_dirname, ".env");
dotenv.config({ path: envFilePath })
// Exportar las variables de entorno para que puedan ser utilizadas en otros archivos
// SERVER
export const PORT = parseInt(process.env.PORT) || 3000;
export const NODE_ENV = process.env.NODE_ENV || 'development';
// DATABASE
export const DB_HOST = process.env.DB_HOST || 'localhost';
export const DB_PORT = parseInt(process.env.DB_PORT) || 5432;
export const DB_USER = process.env.DB_USER;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_NAME = process.env.DB_NAME;
// COOKIE KEY y SESSION SECRET
export const COOKIE_KEY = process.env.COOKIE_KEY;
export const JWT_SECRET = process.env.JWT_SECRET;
