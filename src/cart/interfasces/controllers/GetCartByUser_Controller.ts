import { Request, Response } from 'express';
import { GetCartByUserUseCase } from '../../application/GetCartByUser_UseCase';

export class GetCartByUserController {
  constructor(private readonly useCase: GetCartByUserUseCase) {}

  async run(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        res.status(400).json({ success: false, error: 'ID de usuario inválido' });
        return;
      }

      const cart = await this.useCase.run(userId);
      res.status(200).json({ success: true, cart });

    } catch (error) {
      console.error('❌ Error en GetCartByUserController:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }
}
