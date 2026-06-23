#     PROYECTO METODOLOGÍA DEL DESARROLLO | IECI 2026-1

# 🏠 TECHO PARA CHILE - Sistema de Gestión de Despliegues

## 📋 Descripción General

El sistema permite:
- 📍 Gestionar **cuadrillas de voluntarios** y sus asignaciones
- 🏘️ Organizar **jornadas de construcción** en diferentes viviendas
- 📦 Controlar **inventarios y materiales** por jornada
- 👥 Administrar **usuarios, roles y permisos** (voluntarios, encargados, jefes de cuadrilla)
- 📄 Generar **documentos logísticos** (alimentación, transporte)
- 🗺️ Organizar actividades por **región y ciudad**

---

## 🏗️ Estructura del Proyecto

`
backend/
├── src/
│   ├── config/  # Configuración de BD y Setup inicial
│   │   ├── configDb.js
│   │   ├── configEnv.js
│   │   └── initialSetup.js
│   │
│   ├── controllers/  # Lógica de peticiones HTTP
│   │   ├── auth.controller.js
│   │   ├── usuario.controller.js
│   │   ├── voluntario.controller.js
│   │   ├── cuadrilla.controller.js
│   │   ├── jornada.controller.js
│   │   ├── vivienda.controller.js
│   │   └── documentoLogistico.controller.js
│   │
│   ├── entities/  # Modelos de BD (TypeORM)
│   │   ├── usuario.entity.js
│   │   ├── voluntario.entity.js
│   │   ├── cuadrilla.entity.js
│   │   ├── jornada.entity.js
│   │   ├── vivienda.entity.js
│   │   ├── material.entity.js
│   │   ├── region.entity.js
│   │   ├── ciudad.entity.js
│   │   └── ... (entidades de relación)
│   │
│   ├── services/  # Lógica de negocio
│   │   ├── auth.service.js
│   │   ├── usuario.service.js
│   │   ├── cuadrilla.service.js
│   │   ├── jornada.service.js
│   │   └── ...
│   │
│   ├── routes/  # Definición de endpoints
│   │   ├── auth.routes.js
│   │   ├── usuario.routes.js
│   │   ├── cuadrilla.routes.js
│   │   └── ...
│   │
│   ├── middleware/  # Autenticación y autorización
│   │   ├── authentication.middleware.js
│   │   └── authorization.middleware.js
│   │
│   ├── validations/  # Validación de datos
│   │   ├── auth.validation.js
│   │   ├── usuario.validation.js
│   │   └── ...
│   │
│   ├── handlers/  # Manejadores de respuestas
│   │   └── responseHandlers.js
│   │
│   └── utils/  # Utilidades diversas
│       ├── documentoAlimentacion.util.js
│       └── documentoTransporte.util.js
│
└── package.json

frontend/
└── (Por desarrollar)
`

---

## 🎯 Principales Funcionalidades

### 👤 Gestión de Usuarios y Roles
- **Voluntarios**: Participan en cuadrillas para construcción
- **Jefes de Cuadrilla**: Coordinan grupos de voluntarios
- **Encargados de Voluntarios**: Supervisan encargados centrales
- **Encargados Centrales**: Coordinan actividades generales
- Autenticación segura con JWT

### 🏘️ Gestión de Viviendas
- Registro de viviendas a construir por región/ciudad
- Seguimiento de estado de construcción
- Asignación de cuadrillas a viviendas

### 👥 Gestión de Cuadrillas
- Formación de equipos de voluntarios
- Liderazgo y coordinación
- Asignación a jornadas específicas
- Registro de participación

### 📅 Gestión de Jornadas
- Organización de eventos de construcción
- Cronograma de actividades
- Inventarios específicos por jornada
- Asignación de cuadrillas

### 📦 Control de Inventarios y Materiales
- Seguimiento de materiales por jornada
- Control de recursos disponibles
- Gestión de suministros

### 📄 Documentos Logísticos
- Generación de documentos de alimentación
- Generación de documentos de transporte

---

## 🚀 Tecnologías Utilizadas

- **Backend**: Node.js + Express
- **Base de Datos**: SQL (TypeORM)
- **Autenticación**: JWT
- **Validación**: Esquemas de validación personalizados con Joi

---

## 📦 Requisitos Previos

- Node.js (v14 o superior)
- NPM
- Base de datos SQL configurada

---
