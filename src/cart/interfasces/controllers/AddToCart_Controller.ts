import { Request, Response } from 'express';
import { AddToCartUseCase } from '../../application/AddToCart_UseCase';

export class AddToCartController {
  constructor(private readonly useCase: AddToCartUseCase) {}

  async run(req: Request, res: Response): Promise<void> {
    try {
      const { userId, plantId, quantity, price } = req.body;

      if (!userId || !plantId || !quantity || !price) {
        res.status(400).json({
          success: false,
          error: 'Faltan campos obligatorios',
          missing: {
            userId: !userId,
            plantId: !plantId,
            quantity: !quantity,
            price: !price
          }
        });
      }

      await this.useCase.run(userId, plantId, quantity, price);
      res.status(200).json({ success: true, message: '🌿 Planta agregada al carrito' });

    } catch (error) {
      console.error('❌ Error en AddToCartController:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }
}