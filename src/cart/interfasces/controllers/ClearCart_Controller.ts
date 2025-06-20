import { Request, Response } from 'express';
import { ClearCartUseCase } from '../../application/ClearCartUseCase';

export class ClearCartController {
  constructor(private readonly useCase: ClearCartUseCase) {}

  async run(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        res.status(400).json({ success: false, error: 'ID de usuario inválido' });
        return;
      }

      await this.useCase.run(userId);
      res.status(200).json({ success: true, message: '🧹 Carrito vaciado con éxito' });

    } catch (error) {
      console.error('❌ Error en ClearCartController:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }
}
