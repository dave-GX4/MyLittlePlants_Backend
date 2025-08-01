import { Request, Response } from 'express';
import { GetSellerRequestsUseCase } from '../../application/usecases/GetSellerReques_UseCase';

export class GetSellerRequestsController {
    constructor(private readonly getSellerRequestsUseCase: GetSellerRequestsUseCase) {}

    async run(req: Request, res: Response): Promise<void> {
        try {
            // Llama al caso de uso, que devolverá un array de UserResponse
            const pendingSellers = await this.getSellerRequestsUseCase.run();

            res.status(200).json({
                success: true,
                data: pendingSellers // El array puede estar vacío si no hay solicitudes
            });

        } catch (error) {
            console.error('Error in GetSellerRequestsController:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error while fetching seller requests'
            });
        }
    }
}