require('reflect-metadata');
const AppDataSource = require('./db');

const Ciudad = require('../entities/Ciudad.entity.js');
const Region = require('../entities/Region.entity.js');
const Usuario = require('../entities/Usuario.entity.js');
const Voluntario = require('../entities/Voluntario.entity.js');
const Vivienda = require('../entities/Vivienda.entity.js');
const Cuadrilla = require('../entities/Cuadrilla.entity.js');
const VoluntarioParticipaEnCuadrilla = require('../entities/VoluntarioParticipaEnCuadrilla.entity.js');
const CuadrillaTrabajaEnVivienda = require('../entities/CuadrillaTrabajaEnVivienda.entity.js');

const initialSetup = async () => {
  try {
    console.log('🔄 Iniciando configuración inicial...');
    
    await AppDataSource.initialize();
    console.log('✅ Conexión establecida');
    await AppDataSource.synchronize(true);
    console.log('✅ Tablas creadas/sincronizadas');

    // Opcional: Seeding (Datos iniciales)
    const regionRepository = AppDataSource.getRepository(Region);
    const countRegion = await regionRepository.count();
    if (countRegion === 0) {
      const regionesChile = [
      { nombre: 'Región de Arica y Parinacota' },
      { nombre: 'Región de Tarapacá' },
      { nombre: 'Región de Antofagasta' },
      { nombre: 'Región de Atacama' },
      { nombre: 'Región de Coquimbo' },
      { nombre: 'Región de Valparaíso' },
      { nombre: 'Región del Libertador General Bernardo O\'Higgins' },
      { nombre: 'Región del Maule' },
      { nombre: 'Región de Ñuble' },
      { nombre: 'Región del Biobío' },
      { nombre: 'Región de la Araucanía' },
      { nombre: 'Región de los Ríos' },
      { nombre: 'Región de los Lagos' },
      { nombre: 'Región Aysén del General Carlos Ibáñez del Campo' },
      { nombre: 'Región de Magallanes y Antártica Chilena' },
      { nombre: 'Región Metropolitana de Santiago' }
      ];
      const entitiesRegion = regionRepository.create(regionesChile);
      await regionRepository.save(entitiesRegion);
    }

    const ciudadRepository = AppDataSource.getRepository(Ciudad);
    const countCiudad = await ciudadRepository.count();
    if (countCiudad === 0) {
      const ciudadChile = [
            // Región de Arica y Parinacota (ID: 1)
            { nombre: 'Arica', codigoRegion: 1 },
            { nombre: 'Camarones', codigoRegion: 1 },
            { nombre: 'Putre', codigoRegion: 1 },
            { nombre: 'General Lagos', codigoRegion: 1 },

            // Región de Tarapacá (ID: 2)
            { nombre: 'Alto Hospicio', codigoRegion: 2 },
            { nombre: 'Iquique', codigoRegion: 2 },
            { nombre: 'Huara', codigoRegion: 2 },
            { nombre: 'Camiña', codigoRegion: 2 },
            { nombre: 'Colchane', codigoRegion: 2 },
            { nombre: 'Pica', codigoRegion: 2 },
            { nombre: 'Pozo Almonte', codigoRegion: 2 },

            // Región de Antofagasta (ID: 3)
            { nombre: 'Tocopilla', codigoRegion: 3 },
            { nombre: 'María Elena', codigoRegion: 3 },
            { nombre: 'Calama', codigoRegion: 3 },
            { nombre: 'Ollagüe', codigoRegion: 3 },
            { nombre: 'San Pedro de Atacama', codigoRegion: 3 },
            { nombre: 'Antofagasta', codigoRegion: 3 },
            { nombre: 'Mejillones', codigoRegion: 3 },
            { nombre: 'Sierra Gorda', codigoRegion: 3 },
            { nombre: 'Taltal', codigoRegion: 3 },

            // Región de Atacama (ID: 4)
            { nombre: 'Chañaral', codigoRegion: 4 },
            { nombre: 'Diego de Almagro', codigoRegion: 4 },
            { nombre: 'Copiapó', codigoRegion: 4 },
            { nombre: 'Caldera', codigoRegion: 4 },
            { nombre: 'Tierra Amarilla', codigoRegion: 4 },
            { nombre: 'Vallenar', codigoRegion: 4 },
            { nombre: 'Freirina', codigoRegion: 4 },
            { nombre: 'Huasco', codigoRegion: 4 },
            { nombre: 'Alto del Carmen', codigoRegion: 4 },

            // Región de Coquimbo (ID: 5)
            { nombre: 'La Serena', codigoRegion: 5 },
            { nombre: 'La Higuera', codigoRegion: 5 },
            { nombre: 'Coquimbo', codigoRegion: 5 },
            { nombre: 'Andacollo', codigoRegion: 5 },
            { nombre: 'Vicuña', codigoRegion: 5 },
            { nombre: 'Paihuano', codigoRegion: 5 },
            { nombre: 'Ovalle', codigoRegion: 5 },
            { nombre: 'Río Hurtado', codigoRegion: 5 },
            { nombre: 'Monte Patria', codigoRegion: 5 },
            { nombre: 'Combarbalá', codigoRegion: 5 },
            { nombre: 'Punitaqui', codigoRegion: 5 },
            { nombre: 'Illapel', codigoRegion: 5 },
            { nombre: 'Salamanca', codigoRegion: 5 },
            { nombre: 'Los Vilos', codigoRegion: 5 },
            { nombre: 'Canela', codigoRegion: 5 },

            // Región de Valparaíso (ID: 6)
            { nombre: 'La Ligua', codigoRegion: 6 },
            { nombre: 'Petorca', codigoRegion: 6 },
            { nombre: 'Cabildo', codigoRegion: 6 },
            { nombre: 'Zapallar', codigoRegion: 6 },
            { nombre: 'Papudo', codigoRegion: 6 },
            { nombre: 'Los Andes', codigoRegion: 6 },
            { nombre: 'San Esteban', codigoRegion: 6 },
            { nombre: 'Calle Larga', codigoRegion: 6 },
            { nombre: 'Rinconada', codigoRegion: 6 },
            { nombre: 'San Felipe', codigoRegion: 6 },
            { nombre: 'Putaendo', codigoRegion: 6 },
            { nombre: 'Santa María', codigoRegion: 6 },
            { nombre: 'Panquehue', codigoRegion: 6 },
            { nombre: 'Llaillay', codigoRegion: 6 },
            { nombre: 'Catemu', codigoRegion: 6 },
            { nombre: 'Quillota', codigoRegion: 6 },
            { nombre: 'La Cruz', codigoRegion: 6 },
            { nombre: 'Calera', codigoRegion: 6 },
            { nombre: 'Nogales', codigoRegion: 6 },
            { nombre: 'Hijuelas', codigoRegion: 6 },
            { nombre: 'Limache', codigoRegion: 6 },
            { nombre: 'Olmué', codigoRegion: 6 },
            { nombre: 'Valparaíso', codigoRegion: 6 },
            { nombre: 'Viña del Mar', codigoRegion: 6 },
            { nombre: 'Quintero', codigoRegion: 6 },
            { nombre: 'Puchuncaví', codigoRegion: 6 },
            { nombre: 'Quilpué', codigoRegion: 6 },
            { nombre: 'Villa Alemana', codigoRegion: 6 },
            { nombre: 'Casablanca', codigoRegion: 6 },
            { nombre: 'Concón', codigoRegion: 6 },
            { nombre: 'Juan Fernández', codigoRegion: 6 },
            { nombre: 'San Antonio', codigoRegion: 6 },
            { nombre: 'Cartagena', codigoRegion: 6 },
            { nombre: 'El Tabo', codigoRegion: 6 },
            { nombre: 'El Quisco', codigoRegion: 6 },
            { nombre: 'Algarrobo', codigoRegion: 6 },
            { nombre: 'Santo Domingo', codigoRegion: 6 },
            { nombre: 'Isla de Pascua', codigoRegion: 6 },

            // Región del Libertador General Bernardo O'Higgins (ID: 7)
            { nombre: 'Rancagua', codigoRegion: 7 },
            { nombre: 'Graneros', codigoRegion: 7 },
            { nombre: 'Mostazal', codigoRegion: 7 },
            { nombre: 'Codegua', codigoRegion: 7 },
            { nombre: 'Machalí', codigoRegion: 7 },
            { nombre: 'Olivar', codigoRegion: 7 },
            { nombre: 'Requinoa', codigoRegion: 7 },
            { nombre: 'Rengo', codigoRegion: 7 },
            { nombre: 'Malloa', codigoRegion: 7 },
            { nombre: 'Quinta de Tilcoco', codigoRegion: 7 },
            { nombre: 'San Vicente', codigoRegion: 7 },
            { nombre: 'Pichidegua', codigoRegion: 7 },
            { nombre: 'Peumo', codigoRegion: 7 },
            { nombre: 'Coltauco', codigoRegion: 7 },
            { nombre: 'Coinco', codigoRegion: 7 },
            { nombre: 'Doñihue', codigoRegion: 7 },
            { nombre: 'Las Cabras', codigoRegion: 7 },
            { nombre: 'San Fernando', codigoRegion: 7 },
            { nombre: 'Chimbarongo', codigoRegion: 7 },
            { nombre: 'Placilla', codigoRegion: 7 },
            { nombre: 'Nancagua', codigoRegion: 7 },
            { nombre: 'Chépica', codigoRegion: 7 },
            { nombre: 'Santa Cruz', codigoRegion: 7 },
            { nombre: 'Lolol', codigoRegion: 7 },
            { nombre: 'Pumanque', codigoRegion: 7 },
            { nombre: 'Palmilla', codigoRegion: 7 },
            { nombre: 'Peralillo', codigoRegion: 7 },
            { nombre: 'Pichilemu', codigoRegion: 7 },
            { nombre: 'Navidad', codigoRegion: 7 },
            { nombre: 'Litueche', codigoRegion: 7 },
            { nombre: 'La Estrella', codigoRegion: 7 },
            { nombre: 'Marchihue', codigoRegion: 7 },
            { nombre: 'Paredones', codigoRegion: 7 },

            // Región del Maule (ID: 8)
            { nombre: 'Curicó', codigoRegion: 8 },
            { nombre: 'Teno', codigoRegion: 8 },
            { nombre: 'Romeral', codigoRegion: 8 },
            { nombre: 'Molina', codigoRegion: 8 },
            { nombre: 'Sagrada Familia', codigoRegion: 8 },
            { nombre: 'Hualañé', codigoRegion: 8 },
            { nombre: 'Licantén', codigoRegion: 8 },
            { nombre: 'Vichuquén', codigoRegion: 8 },
            { nombre: 'Rauco', codigoRegion: 8 },
            { nombre: 'Talca', codigoRegion: 8 },
            { nombre: 'Pelarco', codigoRegion: 8 },
            { nombre: 'Río Claro', codigoRegion: 8 },
            { nombre: 'San Clemente', codigoRegion: 8 },
            { nombre: 'Maule', codigoRegion: 8 },
            { nombre: 'San Rafael', codigoRegion: 8 },
            { nombre: 'Empedrado', codigoRegion: 8 },
            { nombre: 'Pencahue', codigoRegion: 8 },
            { nombre: 'Constitución', codigoRegion: 8 },
            { nombre: 'Curepto', codigoRegion: 8 },
            { nombre: 'Linares', codigoRegion: 8 },
            { nombre: 'Yerbas Buenas', codigoRegion: 8 },
            { nombre: 'Colbún', codigoRegion: 8 },
            { nombre: 'Longaví', codigoRegion: 8 },
            { nombre: 'Parral', codigoRegion: 8 },
            { nombre: 'Retiro', codigoRegion: 8 },
            { nombre: 'Villa Alegre', codigoRegion: 8 },
            { nombre: 'San Javier', codigoRegion: 8 },
            { nombre: 'Cauquenes', codigoRegion: 8 },
            { nombre: 'Pelluhue', codigoRegion: 8 },
            { nombre: 'Chanco', codigoRegion: 8 },

            // Región de Ñuble (ID: 9)
            { nombre: 'Bulnes', codigoRegion: 9 },
            { nombre: 'Chillán', codigoRegion: 9 },
            { nombre: 'Chillán Viejo', codigoRegion: 9 },
            { nombre: 'El Carmen', codigoRegion: 9 },
            { nombre: 'Pemuco', codigoRegion: 9 },
            { nombre: 'Pinto', codigoRegion: 9 },
            { nombre: 'Quillón', codigoRegion: 9 },
            { nombre: 'San Ignacio', codigoRegion: 9 },
            { nombre: 'Yungay', codigoRegion: 9 },
            { nombre: 'San Carlos', codigoRegion: 9 },
            { nombre: 'Coihueco', codigoRegion: 9 },
            { nombre: 'Ñiquén', codigoRegion: 9 },
            { nombre: 'San Fabián', codigoRegion: 9 },
            { nombre: 'San Nicolás', codigoRegion: 9 },
            { nombre: 'Quirihue', codigoRegion: 9 },
            { nombre: 'Cobquecura', codigoRegion: 9 },
            { nombre: 'Coelemu', codigoRegion: 9 },
            { nombre: 'Ninhue', codigoRegion: 9 },
            { nombre: 'Portezuelo', codigoRegion: 9 },
            { nombre: 'Ránquil', codigoRegion: 9 },
            { nombre: 'Trehuaco', codigoRegion: 9 },

            // Región del Biobío (ID: 10)
            { nombre: 'Alto Biobío', codigoRegion: 10 },
            { nombre: 'Los Angeles', codigoRegion: 10 },
            { nombre: 'Cabrero', codigoRegion: 10 },
            { nombre: 'Tucapel', codigoRegion: 10 },
            { nombre: 'Antuco', codigoRegion: 10 },
            { nombre: 'Quilleco', codigoRegion: 10 },
            { nombre: 'Santa Bárbara', codigoRegion: 10 },
            { nombre: 'Quilaco', codigoRegion: 10 },
            { nombre: 'Mulchén', codigoRegion: 10 },
            { nombre: 'Negrete', codigoRegion: 10 },
            { nombre: 'Nacimiento', codigoRegion: 10 },
            { nombre: 'Laja', codigoRegion: 10 },
            { nombre: 'San Rosendo', codigoRegion: 10 },
            { nombre: 'Yumbel', codigoRegion: 10 },
            { nombre: 'Concepción', codigoRegion: 10 },
            { nombre: 'Talcahuano', codigoRegion: 10 },
            { nombre: 'Penco', codigoRegion: 10 },
            { nombre: 'Tomé', codigoRegion: 10 },
            { nombre: 'Florida', codigoRegion: 10 },
            { nombre: 'Hualpén', codigoRegion: 10 },
            { nombre: 'Hualqui', codigoRegion: 10 },
            { nombre: 'Santa Juana', codigoRegion: 10 },
            { nombre: 'Lota', codigoRegion: 10 },
            { nombre: 'Coronel', codigoRegion: 10 },
            { nombre: 'San Pedro de la Paz', codigoRegion: 10 },
            { nombre: 'Chiguayante', codigoRegion: 10 },
            { nombre: 'Lebu', codigoRegion: 10 },
            { nombre: 'Arauco', codigoRegion: 10 },
            { nombre: 'Curanilahue', codigoRegion: 10 },
            { nombre: 'Los Alamos', codigoRegion: 10 },
            { nombre: 'Cañete', codigoRegion: 10 },
            { nombre: 'Contulmo', codigoRegion: 10 },
            { nombre: 'Tirua', codigoRegion: 10 },

            // Región de la Araucanía (ID: 11)
            { nombre: 'Angol', codigoRegion: 11 },
            { nombre: 'Renaico', codigoRegion: 11 },
            { nombre: 'Collipulli', codigoRegion: 11 },
            { nombre: 'Lonquimay', codigoRegion: 11 },
            { nombre: 'Curacautín', codigoRegion: 11 },
            { nombre: 'Ercilla', codigoRegion: 11 },
            { nombre: 'Victoria', codigoRegion: 11 },
            { nombre: 'Traiguén', codigoRegion: 11 },
            { nombre: 'Lumaco', codigoRegion: 11 },
            { nombre: 'Purén', codigoRegion: 11 },
            { nombre: 'Los Sauces', codigoRegion: 11 },
            { nombre: 'Temuco', codigoRegion: 11 },
            { nombre: 'Lautaro', codigoRegion: 11 },
            { nombre: 'Perquenco', codigoRegion: 11 },
            { nombre: 'Vilcún', codigoRegion: 11 },
            { nombre: 'Cholchol', codigoRegion: 11 },
            { nombre: 'Cunco', codigoRegion: 11 },
            { nombre: 'Melipeuco', codigoRegion: 11 },
            { nombre: 'Curarrehue', codigoRegion: 11 },
            { nombre: 'Pucón', codigoRegion: 11 },
            { nombre: 'Villarrica', codigoRegion: 11 },
            { nombre: 'Freire', codigoRegion: 11 },
            { nombre: 'Pitrufquén', codigoRegion: 11 },
            { nombre: 'Gorbea', codigoRegion: 11 },
            { nombre: 'Loncoche', codigoRegion: 11 },
            { nombre: 'Toltén', codigoRegion: 11 },
            { nombre: 'Teodoro Schmidt', codigoRegion: 11 },
            { nombre: 'Saavedra', codigoRegion: 11 },
            { nombre: 'Carahue', codigoRegion: 11 },
            { nombre: 'Nueva Imperial', codigoRegion: 11 },
            { nombre: 'Galvarino', codigoRegion: 11 },
            { nombre: 'Padre las Casas', codigoRegion: 11 },

            // Región de los Ríos (ID: 12)
            { nombre: 'Valdivia', codigoRegion: 12 },
            { nombre: 'Mariquina', codigoRegion: 12 },
            { nombre: 'Lanco', codigoRegion: 12 },
            { nombre: 'Máfil', codigoRegion: 12 },
            { nombre: 'Corral', codigoRegion: 12 },
            { nombre: 'Los Lagos', codigoRegion: 12 },
            { nombre: 'Panguipulli', codigoRegion: 12 },
            { nombre: 'Paillaco', codigoRegion: 12 },
            { nombre: 'La Unión', codigoRegion: 12 },
            { nombre: 'Futrono', codigoRegion: 12 },
            { nombre: 'Río Bueno', codigoRegion: 12 },
            { nombre: 'Lago Ranco', codigoRegion: 12 },

            // Región de los Lagos (ID: 13)
            { nombre: 'Osorno', codigoRegion: 13 },
            { nombre: 'San Pablo', codigoRegion: 13 },
            { nombre: 'Puyehue', codigoRegion: 13 },
            { nombre: 'Puerto Octay', codigoRegion: 13 },
            { nombre: 'Purranque', codigoRegion: 13 },
            { nombre: 'Río Negro', codigoRegion: 13 },
            { nombre: 'San Juan de la Costa', codigoRegion: 13 },
            { nombre: 'Puerto Montt', codigoRegion: 13 },
            { nombre: 'Puerto Varas', codigoRegion: 13 },
            { nombre: 'Cochamó', codigoRegion: 13 },
            { nombre: 'Calbuco', codigoRegion: 13 },
            { nombre: 'Maullín', codigoRegion: 13 },
            { nombre: 'Los Muermos', codigoRegion: 13 },
            { nombre: 'Fresia', codigoRegion: 13 },
            { nombre: 'Llanquihue', codigoRegion: 13 },
            { nombre: 'Frutillar', codigoRegion: 13 },
            { nombre: 'Castro', codigoRegion: 13 },
            { nombre: 'Ancud', codigoRegion: 13 },
            { nombre: 'Quemchi', codigoRegion: 13 },
            { nombre: 'Dalcahue', codigoRegion: 13 },
            { nombre: 'Curaco de Vélez', codigoRegion: 13 },
            { nombre: 'Quinchao', codigoRegion: 13 },
            { nombre: 'Puqueldón', codigoRegion: 13 },
            { nombre: 'Chonchi', codigoRegion: 13 },
            { nombre: 'Queilén', codigoRegion: 13 },
            { nombre: 'Quellón', codigoRegion: 13 },
            { nombre: 'Chaitén', codigoRegion: 13 },
            { nombre: 'Hualaihué', codigoRegion: 13 },
            { nombre: 'Futaleufú', codigoRegion: 13 },
            { nombre: 'Palena', codigoRegion: 13 },

            // Región Aysén del General Carlos Ibáñez del Campo (ID: 14)
            { nombre: 'Coyhaique', codigoRegion: 14 },
            { nombre: 'Lago Verde', codigoRegion: 14 },
            { nombre: 'Aysén', codigoRegion: 14 },
            { nombre: 'Cisnes', codigoRegion: 14 },
            { nombre: 'Guaitecas', codigoRegion: 14 },
            { nombre: 'Chile Chico', codigoRegion: 14 },
            { nombre: 'Río Ibánez', codigoRegion: 14 },
            { nombre: 'Cochrane', codigoRegion: 14 },
            { nombre: 'O\'Higgins', codigoRegion: 14 },
            { nombre: 'Tortel', codigoRegion: 14 },

            // Región de Magallanes y Antártica Chilena (ID: 15)
            { nombre: 'Natales', codigoRegion: 15 },
            { nombre: 'Torres del Paine', codigoRegion: 15 },
            { nombre: 'Punta Arenas', codigoRegion: 15 },
            { nombre: 'Río Verde', codigoRegion: 15 },
            { nombre: 'Laguna Blanca', codigoRegion: 15 },
            { nombre: 'San Gregorio', codigoRegion: 15 },
            { nombre: 'Porvenir', codigoRegion: 15 },
            { nombre: 'Primavera', codigoRegion: 15 },
            { nombre: 'Timaukel', codigoRegion: 15 },
            { nombre: 'Cabo de Hornos', codigoRegion: 15 },
            { nombre: 'Antártica', codigoRegion: 15 },

            // Región Metropolitana de Santiago (ID: 16)
            { nombre: 'Santiago', codigoRegion: 16 },
            { nombre: 'Independencia', codigoRegion: 16 },
            { nombre: 'Conchalí', codigoRegion: 16 },
            { nombre: 'Huechuraba', codigoRegion: 16 },
            { nombre: 'Recoleta', codigoRegion: 16 },
            { nombre: 'Providencia', codigoRegion: 16 },
            { nombre: 'Vitacura', codigoRegion: 16 },
            { nombre: 'Lo Barnechea', codigoRegion: 16 },
            { nombre: 'Las Condes', codigoRegion: 16 },
            { nombre: 'Ñuñoa', codigoRegion: 16 },
            { nombre: 'La Reina', codigoRegion: 16 },
            { nombre: 'Macul', codigoRegion: 16 },
            { nombre: 'Peñalolén', codigoRegion: 16 },
            { nombre: 'La Florida', codigoRegion: 16 },
            { nombre: 'San Joaquín', codigoRegion: 16 },
            { nombre: 'La Granja', codigoRegion: 16 },
            { nombre: 'La Pintana', codigoRegion: 16 },
            { nombre: 'San Ramón', codigoRegion: 16 },
            { nombre: 'San Miguel', codigoRegion: 16 },
            { nombre: 'La Cisterna', codigoRegion: 16 },
            { nombre: 'El Bosque', codigoRegion: 16 },
            { nombre: 'Pedro Aguirre Cerda', codigoRegion: 16 },
            { nombre: 'Lo Espejo', codigoRegion: 16 },
            { nombre: 'Estación Central', codigoRegion: 16 },
            { nombre: 'Cerrillos', codigoRegion: 16 },
            { nombre: 'Maipú', codigoRegion: 16 },
            { nombre: 'Quinta Normal', codigoRegion: 16 },
            { nombre: 'Lo Prado', codigoRegion: 16 },
            { nombre: 'Pudahuel', codigoRegion: 16 },
            { nombre: 'Cerro Navia', codigoRegion: 16 },
            { nombre: 'Renca', codigoRegion: 16 },
            { nombre: 'Quilicura', codigoRegion: 16 },
            { nombre: 'Colina', codigoRegion: 16 },
            { nombre: 'Lampa', codigoRegion: 16 },
            { nombre: 'Tiltil', codigoRegion: 16 },
            { nombre: 'Puente Alto', codigoRegion: 16 },
            { nombre: 'San José de Maipo', codigoRegion: 16 },
            { nombre: 'Pirque', codigoRegion: 16 },
            { nombre: 'San Bernardo', codigoRegion: 16 },
            { nombre: 'Buin', codigoRegion: 16 },
            { nombre: 'Paine', codigoRegion: 16 },
            { nombre: 'Calera de Tango', codigoRegion: 16 },
            { nombre: 'Melipilla', codigoRegion: 16 },
            { nombre: 'María Pinto', codigoRegion: 16 },
            { nombre: 'Curacaví', codigoRegion: 16 },
            { nombre: 'Alhué', codigoRegion: 16 },
            { nombre: 'San Pedro', codigoRegion: 16 },
            { nombre: 'Talagante', codigoRegion: 16 },
            { nombre: 'Peñaflor', codigoRegion: 16 },
            { nombre: 'Isla de Maipo', codigoRegion: 16 },
            { nombre: 'El Monte', codigoRegion: 16 },
            { nombre: 'Padre Hurtado', codigoRegion: 16 }
        ];
      const ciudadesEntities = ciudadChile.map((c) => {
        const { codigoRegion, ...rest } = c;
        return ciudadRepository.create({ ...rest, region: { codigo: codigoRegion } });
      });
      await ciudadRepository.save(ciudadesEntities);
    }
    // PARA PRUEBAS
    const usuarioRepository = AppDataSource.getRepository(Usuario);
    const voluntarioRepository = AppDataSource.getRepository(Voluntario);
    const viviendaRepository = AppDataSource.getRepository(Vivienda);
    const cuadrillaRepository = AppDataSource.getRepository(Cuadrilla);
    const voluntarioParticipaRepository = AppDataSource.getRepository(VoluntarioParticipaEnCuadrilla);
    const cuadrillaTrabajaRepository = AppDataSource.getRepository(CuadrillaTrabajaEnVivienda);
    // =========================================================================
    // INSERCIÓN DE 15 USUARIOS Y SUS 15 PERFILES DE VOLUNTARIOS
    // =========================================================================
    const countUsuarios = await usuarioRepository.count();
    if (countUsuarios === 0) {
      console.log('🌱 Insertando 15 voluntarios y usuarios de prueba...');

      const listadoPlano = [
        { rut: '11.111.111-1', nombre: 'Juan', primerApellido: 'Pérez', segundoApellido: 'Alarcón', email: 'juan@gmail.com', telEmergencia: '+56911111111' },
        { rut: '22.222.222-2', nombre: 'María', primerApellido: 'García', segundoApellido: 'Soto', email: 'maria@gmail.com', telEmergencia: '+56922222222' },
        { rut: '33.333.333-3', nombre: 'Carlos', primerApellido: 'Rojas', segundoApellido: 'Mendoza', email: 'carlos@gmail.com', telEmergencia: '+56933333333' },
        { rut: '44.444.444-4', nombre: 'Ana', primerApellido: 'Silva', segundoApellido: 'Fuentes', email: 'ana@gmail.com', telEmergencia: '+56944444444' },
        { rut: '55.555.555-5', nombre: 'Pedro', primerApellido: 'López', segundoApellido: 'Castro', email: 'pedro@gmail.com', telEmergencia: '+56955555555' },
        { rut: '66.666.666-6', nombre: 'Francisca', primerApellido: 'Torres', segundoApellido: 'Gómez', email: 'fran@gmail.com', telEmergencia: '+56966666666' },
        { rut: '77.777.777-7', nombre: 'Diego', primerApellido: 'Morales', segundoApellido: 'Vera', email: 'diego@gmail.com', telEmergencia: '+56977777777' },
        { rut: '88.888.888-8', nombre: 'Camila', primerApellido: 'Herrera', segundoApellido: 'Muñoz', email: 'camila@gmail.com', telEmergencia: '+56988888888' },
        { rut: '99.999.999-9', nombre: 'Luis', primerApellido: 'Contreras', segundoApellido: 'Espinoza', email: 'luis@gmail.com', telEmergencia: '+56999999999' },
        { rut: '10.101.101-0', nombre: 'Sofía', primerApellido: 'Araya', segundoApellido: 'Sepúlveda', email: 'sofia@gmail.com', telEmergencia: '+56910101010' },
        { rut: '12.121.121-2', nombre: 'Manuel', primerApellido: 'Vergara', segundoApellido: 'Sanhueza', email: 'manuel@gmail.com', telEmergencia: '+56912121212' },
        { rut: '13.131.131-3', nombre: 'Valentina', primerApellido: 'Miranda', segundoApellido: 'Jara', email: 'vale@gmail.com', telEmergencia: '+56913131313' },
        { rut: '14.141.141-4', nombre: 'Andrés', primerApellido: 'Salinas', segundoApellido: 'Ríos', email: 'andres@gmail.com', telEmergencia: '+56914141414' },
        { rut: '15.151.151-5', nombre: 'Bárbara', primerApellido: 'Pinto', segundoApellido: 'Navarro', email: 'barbara@gmail.com', telEmergencia: '+56915151515' },
        { rut: '16.161.161-6', nombre: 'Cristóbal', primerApellido: 'Muñoz', segundoApellido: 'Henríquez', email: 'cristobal@gmail.com', telEmergencia: '+56916161616' }
      ];

      for (const item of listadoPlano) {
        // A) Insertar Usuario Base
        await usuarioRepository.save({
          rut: item.rut,
          password: 'password123',
          nombre: item.nombre,
          primerApellido: item.primerApellido,
          segundoApellido: item.segundoApellido,
          fechaNacimiento: '1995-05-15',
          email: item.email,
          telefono: '+56988887777',
          rol: 'Voluntario',
          ciudad: { codigo: 181 }
        });
        // B) Insertar Perfil de Voluntario Asociado
        await voluntarioRepository.save({
          rutUsuario: item.rut,
          tipo: 'General',
          estado: 'Activo', // Clave para que tu backend los considere en el traslado
          solicitudActiva: true,
          fechaValidacionDatos: '2026-03-10',
          fechaActivacionSolicitud: '2026-03-11',
          telefonoEmergencia: item.telEmergencia // Clave para pasar el filtro del reporte
        });
      }
    }

    // =========================================================================
    // INSERCIÓN DE 6 VIVIENDAS (Todas en estado 'planificacion' en Concepción)
    // =========================================================================
    const countViviendas = await viviendaRepository.count();
    if (countViviendas === 0) {
      console.log('🌱 Insertando 6 viviendas en planificación...');
      
      const obras = [
        { codigo: 'CONCE-001', direccion: 'Sector Palomares Pasaje Sur 45', tipo: 'Vivienda de Emergencia Provisoria' },
        { codigo: 'CONCE-002', direccion: 'Collao Avenida Ignacio Collao 2100', tipo: 'Vivienda de Emergencia Provisoria' },
        { codigo: 'CONCE-003', direccion: 'Agüita de la Perdiz Calle Central 89', tipo: 'Módulo Habitacional Completo' },
        { codigo: 'CONCE-004', direccion: 'Barrio Norte Calle Manuel Rodríguez 412', tipo: 'Vivienda de Emergencia Provisoria' },
        { codigo: 'CONCE-005', direccion: 'Lorenzo Arenas Pasaje Los Tilos 72', tipo: 'Módulo Habitacional Completo' },
        { codigo: 'CONCE-006', direccion: 'Nonguén Camino Público Km 4.5', tipo: 'Vivienda de Emergencia Provisoria' }
      ];

      
      for (const obra of obras) {
        await viviendaRepository.save({
          codigo: obra.codigo,
          direccion: obra.direccion,
          tipoObra: obra.tipo,
          estado: 'planificacion', // Requisito estricto de tu consulta SQL/TypeORM
          porcentajeAvance: 0,
          fechaInicioEstimada: '2026-06-15',
          fechaFinEstimada: '2026-06-22', // Generará una estancia de 7 días para el cálculo de comida
          fechaFinReal: null,
          montajeEstructural: false,
          habilidadTecnica: false,
          conexionesBasicas: false,
          observacionesValidacion: 'Zona despejada y apta cartográficamente para construcción.',
          ciudad: { codigo: 181 }
        });
      }
    }

    // =========================================================================
    // INSERCIÓN DE 4 CUADRILLAS
    // =========================================================================
    const countCuadrillas = await cuadrillaRepository.count();
    if (countCuadrillas === 0) {
      console.log('🌱 Insertando 4 cuadrillas de trabajo...');
      
      await cuadrillaRepository.save({ codigo: 'CUAD-ALFA', descripcion: 'Cuadrilla Alfa - Biobío' });
      await cuadrillaRepository.save({ codigo: 'CUAD-BETA', descripcion: 'Cuadrilla Beta - Construcción' });
      await cuadrillaRepository.save({ codigo: 'CUAD-GAMMA', descripcion: 'Cuadrilla Gamma - Soporte' });
      await cuadrillaRepository.save({ codigo: 'CUAD-DELTA', descripcion: 'Cuadrilla Delta - Avanzada' });
    }

    // =========================================================================
    // ASIGNACIÓN DE VOLUNTARIOS A CUADRILLAS (Mínimo 3 por cuadrilla)
    // =========================================================================
    const countVolParticipa = await voluntarioParticipaRepository.count();
    if (countVolParticipa === 0) {
      console.log('🌱 Distribuyendo voluntarios en las cuadrillas...');

      const asignaciones = [
        // Cuadrilla Alfa (4 integrantes)
        { rut: '11.111.111-1', cuad: 'CUAD-ALFA' },
        { rut: '22.222.222-2', cuad: 'CUAD-ALFA' },
        { rut: '33.333.333-3', cuad: 'CUAD-ALFA' },
        { rut: '44.444.444-4', cuad: 'CUAD-ALFA' },

        // Cuadrilla Beta (4 integrantes)
        { rut: '55.555.555-5', cuad: 'CUAD-BETA' },
        { rut: '66.666.666-6', cuad: 'CUAD-BETA' },
        { rut: '77.777.777-7', cuad: 'CUAD-BETA' },
        { rut: '88.888.888-8', cuad: 'CUAD-BETA' },

        // Cuadrilla Gamma (4 integrantes)
        { rut: '99.999.999-9', cuad: 'CUAD-GAMMA' },
        { rut: '10.101.101-0', cuad: 'CUAD-GAMMA' },
        { rut: '12.121.121-2', cuad: 'CUAD-GAMMA' },
        { rut: '13.131.131-3', cuad: 'CUAD-GAMMA' },

        // Cuadrilla Delta (3 integrantes)
        { rut: '14.141.141-4', cuad: 'CUAD-DELTA' },
        { rut: '15.151.151-5', cuad: 'CUAD-DELTA' },
        { rut: '16.161.161-6', cuad: 'CUAD-DELTA' }
      ];

      for (const asig of asignaciones) {
        await voluntarioParticipaRepository.save({
          rutVoluntario: asig.rut,
          codigoCuadrilla: asig.cuad,
          fechaInicio: '2026-03-15',
          fechaFin: null // Se mantienen activos dentro de la cuadrilla
        });
      }
    }

    // =========================================================================
    // ASIGNACIÓN DE CUADRILLAS A LAS VIVIENDAS (Asociaciones de trabajo)
    // =========================================================================
    const countCuadrillaTrabaja = await cuadrillaTrabajaRepository.count();
    if (countCuadrillaTrabaja === 0) {
      console.log('🌱 Vinculando cuadrillas a los proyectos de vivienda...');

      const despliegues = [
        { cuad: 'CUAD-ALFA', viv: 'CONCE-001' },
        { cuad: 'CUAD-BETA', viv: 'CONCE-003' },
        { cuad: 'CUAD-GAMMA', viv: 'CONCE-004' },
        { cuad: 'CUAD-DELTA', viv: 'CONCE-006' }
      ];

      for (const despliegue of despliegues) {
        await cuadrillaTrabajaRepository.save({
          codigoCuadrilla: despliegue.cuad,
          codigoVivienda: despliegue.viv,
          fechaInicio: '2026-06-15',
          fechaFin: null // Siguen asignados trabajando activamente en la planificación de la obra
        });
      }
      console.log('✨ Base de datos poblada con éxito para simulación logística.');
    }
    process.exit(0);
  } catch (error) {
    console.error('❌ Error durante la configuración inicial:', error);
    process.exit(1);
  }
};

initialSetup();
