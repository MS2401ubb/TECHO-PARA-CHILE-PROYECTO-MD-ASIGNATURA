import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/configDb.js";
import { JWT_SECRET } from "../config/configEnv.js";
import { User } from "../entities/usuario.entity.js";

export async function loginService(data) {
    const userRepository = AppDataSource.getRepository(User);
    
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
            rol: user.rol
        }
    };
}

export async function registerService(data) {
    const userRepository = AppDataSource.getRepository(User);
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    const newUser = userRepository.create({
            rut: data.rut,
            password: hashedPassword,
            nombre: data.nombre,
            primerApellido: data.primerApellido,
            segundoApellido: data.segundoApellido,
            fechaNacimiento: data.fechaNacimiento,
            email: data.email,
            telefono: data.telefono,
            rol: data.rol
    });
    
    return await userRepository.save(newUser);
}