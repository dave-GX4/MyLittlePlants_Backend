import { Request, Response } from 'express';
import { GetByIdUseCase } from '../../application/GetById_UseCase';
import { NotFoundError } from '../../domain/objectValues/NotFoundError';

export class GetByIdController {
    constructor(private readonly getByIdUseCase: GetByIdUseCase) {}

    async run(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            
            if (isNaN(id)) {
                res.status(400).json({
                success: false,
                error: 'Invalid ID format'
                });
                return;
            }

            // Ejecutar el caso de uso
            const user = await this.getByIdUseCase.run(id);

            // Convertir a DTO para la respuesta
            const userResponse = {
                id: user.id,
                name: user.name.value,
                email: user.email.value,
                phone: user.phone?.value ?? null
                // Excluir información sensible como password
            };

            res.status(200).json({
                success: true,
                data: userResponse
            });

        } catch (error) {
            if (error instanceof NotFoundError) {
                res.status(404).json({
                success: false,
                error: error.message
                });
            } else {
                console.error('Error in GetByIdController:', error);
                res.status(500).json({
                success: false,
                error: 'Internal server error while fetching user'
                });
            }
        }
    }
}