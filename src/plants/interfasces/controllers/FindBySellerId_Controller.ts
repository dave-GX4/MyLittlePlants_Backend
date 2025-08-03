import { Request, Response } from 'express';
import { GetPlantsBySellerUseCase } from '../../application/FindBySellerId_UseCase';

export class GetPlantsBySellerController {
    constructor(private readonly getPlantsBySellerUseCase: GetPlantsBySellerUseCase) {}

    async run(req: Request, res: Response): Promise<void> {
        try {
            // 1. Obtener el usuario autenticado desde el middleware
            const user = (req as any).user;

            // 2. Verificación de seguridad
            if (!user || !user.id) {
                res.status(401).json({ message: 'No autenticado. Por favor, inicie sesión.' });
                return;
            }
            
            // Opcional: Podrías verificar si tiene el rol de vendedor también
            if (user.role !== 'Vendedor') {
                res.status(403).json({ message: 'Acceso denegado. Se requiere rol de vendedor.' });
                return;
            }

            const sellerId = user.id;

            // Llamar al caso de uso con el ID del vendedor autenticado
            const plants = await this.getPlantsBySellerUseCase.run(sellerId);

            // Enviar la respuesta
            // Devolvemos los datos de las plantas. Es útil también enviar un mensaje.
            res.status(200).json({
                message: `Se encontraron ${plants.length} plantas para el vendedor.`,
                data: plants,
                success: true
            });

        } catch (error) {
            console.error("Error en GetPlantsBySellerController:", error);
            res.status(500).json({
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error',
                success: false
            });
        }
    }
}