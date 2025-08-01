import { Request, Response } from 'express';
import { LoginUseCase } from '../../application/usecases/Login_UseCase';

export class LoginController {
    constructor(private readonly loginUseCase: LoginUseCase) {}

    async run(req: Request, res: Response): Promise<void> {
        try {
            // 1. Extraemos el email y la contraseña del cuerpo de la petición.
            const { email, password } = req.body;

            // 2. Validamos que ambos campos hayan sido proporcionados.
            if (!email || !password) {
                res.status(400).json({
                    success: false,
                    error: 'Se requieren tanto el email como la contraseña.'
                });
                return;
            }

            // 3. Ejecutamos el caso de uso con los datos recibidos.
            const result = await this.loginUseCase.run(email, password);

            // 4. Manejamos la respuesta del caso de uso.
            if (result) {
                // Éxito: El caso de uso devolvió el objeto con el token y el usuario.
                // Enviamos una respuesta 200 OK con los datos.
                res.status(200).json({
                    success: true,
                    message: 'Inicio de sesión exitoso.',
                    data: {
                        token: result.token,
                        user: result.user
                    }
                });
            } else {
                // Falla: El caso de uso devolvió null (email no encontrado o contraseña incorrecta).
                // Enviamos una respuesta 401 Unauthorized.
                res.status(401).json({
                    success: false,
                    error: 'Credenciales inválidas. Por favor, verifique su email y contraseña.'
                });
            }

        } catch (error) {
            // 5. Capturamos cualquier error inesperado del servidor.
            console.error('Error en LoginController:', error);
            res.status(500).json({
                success: false,
                error: 'Ocurrió un error interno en el servidor.'
            });
        }
    }
}