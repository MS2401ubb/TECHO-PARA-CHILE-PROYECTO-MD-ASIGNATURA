import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/configDb.js";
import { JWT_SECRET } from "../config/configEnv.js";
import User from "../entities/usuario.entity.js";
import Voluntario from "../entities/voluntario.entity.js";
import {ROLES_VOLUNTARIOS} from "../../../frontend/src/constants/roles.js"


export async function loginService(data) {
    const userRepository = AppDataSource.getRepository(User);
    const voluntarioRepository = AppDataSource.getRepository(Voluntario);
    
    const { rut, password } = data;
    // BUSCAMOS EL USUARIO RUT
    const user = await userRepository.findOne({ where: { rut } });
    if (!user) {
        throw new Error("RUT no registrado.");
    }
    // COMPARAR CONTRASEÑAS
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error("Contraseña incorrecta.");
    }
    // SI ES VALIDO, GENERAMOS UN TOKEN JWT
    const token = jwt.sign(
        {
            rut: user.rut,
            email: user.email,
            rol: user.rol
        },
        JWT_SECRET,
        { expiresIn: "24h" }
    );

    const isCualquierVoluntario = ROLES_VOLUNTARIOS.includes(user.rol);

    const voluntario = isCualquierVoluntario
        ? await voluntarioRepository.findOne({ where: { rutUsuario: user.rut } })
        : null;
    
    return {
        token,
        user: {
            rut: user.rut,
            nombre: user.nombre,
            primerApellido: user.primerApellido,
            segundoApellido: user.segundoApellido,
            fechaNacimiento: user.fechaNacimiento,
            email: user.email,
            telefono: user.telefono,
            rol: user.rol,
            estadoVoluntario: voluntario?.estado || null,
            motivoRechazo: voluntario?.motivoRechazo || null,
            comentarioPostulacion: voluntario?.comentarioPostulacion || null
        }
    };
}

export async function registerService(data) {

    const userRepository = AppDataSource.getRepository(User);
    const ciudadRepository = AppDataSource.getRepository('Ciudad');
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const ciudad = await ciudadRepository.findOne({
        where: { codigo: data.codigoCiudad }
    });

    if (!ciudad) {
        throw new Error('La ciudad seleccionada no existe.');
    }
    
    const newUser = userRepository.create({
            rut: data.rut,
            password: hashedPassword,
            nombre: data.nombre,
            primerApellido: data.primerApellido,
            segundoApellido: data.segundoApellido,
            fechaNacimiento: data.fechaNacimiento,
            email: data.email,
            telefono: data.telefono,
                rol: data.rol,
                ciudad: { codigo: data.codigoCiudad }
    });
    
    const savedUser = await userRepository.save(newUser);

    // Si el rol es Voluntario, crear también el perfil en la tabla `voluntarios` como Postulante
    if (data.rol === 'Voluntario') {
        const voluntarioRepository = AppDataSource.getRepository(Voluntario);
        await voluntarioRepository.save({
            rutUsuario: savedUser.rut,
            tipo: data.tipo || 'General',
            estado: 'Postulante',
            comentarioPostulacion: data.comentarioPostulacion?.trim() || null,
            solicitudActiva: true,
            telefonoEmergencia: data.telefonoEmergencia || null
        });
    }

    return savedUser;
}