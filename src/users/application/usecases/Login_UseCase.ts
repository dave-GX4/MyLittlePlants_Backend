// users/application/usecases/Login_UseCase.ts

import { UserRepository } from "../../domain/User_Repository";
import { IPasswordHashService } from "../../domain/service/PasswordHashService";
import { UserResponse } from "../DTOs/User_DTO";
import jwt from 'jsonwebtoken';

export class LoginUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly passwordHashService: IPasswordHashService
    ) {}

    // 2. Cambiamos el tipo de retorno para que devuelva el token y los datos del usuario.
    async run(email: string, password_raw: string): Promise<{ token: string; user: UserResponse } | null> {
        
        const user = await this.userRepository.finedByEmail(email);
        if (!user) {
            console.log(`Intento de login fallido: email ${email} no encontrado.`);
            return null;
        }

        const isPasswordCorrect = await this.passwordHashService.compare(password_raw, user.password.value);
        if (!isPasswordCorrect) {
            console.log(`Intento de login fallido: contraseña incorrecta para ${email}.`);
            return null;
        }

        // El 'payload' son los datos que guardaremos dentro del token.
        // ¡Nunca guardar información sensible como la contraseña aquí!
        const payload = {
            id: user.id,
            email: user.email.value,
            role: user.role.value
        };

        const secretKey = process.env.JWT_SECRET;
        if (!secretKey) {
            // Este error detiene el servidor si la clave secreta no está configurada, lo cual es bueno.
            throw new Error("La clave secreta JWT_SECRET no está definida en el archivo .env");
        }

        // Firmamos el token
        const token = jwt.sign(payload, secretKey, {
            expiresIn: '8h'
        });

        // 4. Preparamos la respuesta para el cliente
        const userResponse: UserResponse = {
            id: user.id!,
            name: user.name.value,
            email: user.email.value,
            role: user.role.value,
            wantsToBeSeller: user.wantsToBeSeller,
            phone: user.phone?.value
        };

        // Devolvemos el token y los datos del usuario.
        return { token, user: userResponse };
    }
}