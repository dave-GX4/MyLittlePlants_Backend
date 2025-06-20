import { Request, Response } from 'express';
import { RemoveFromCartUseCase } from '../../application/RemoveItemFromCart_UseCase';

export class RemoveItemFromCartController {
  constructor(private readonly useCase: RemoveFromCartUseCase) {}

  async run(req: Request, res: Response): Promise<void> {
    try {
      const { userId, plantId } = req.body;

      if (!userId || !plantId) {
        res.status(400).json({
          success: false,
          error: 'Faltan userId o plantId'
        });
      }

      await this.useCase.run(userId, plantId);
      res.status(200).json({ success: true, message: '🗑️ Planta eliminada del carrito' });

    } catch (error) {
      console.error('❌ Error en RemoveItemFromCartController:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }
}
