import { Request, Response } from 'express';
import { UpdateUserUseCase } from '../../application/UpdateUser_UseCase';
import { NotFoundError } from '../../domain/objectValues/NotFoundError';

export class UpdateUserController {
  constructor(private updateUserUseCase: UpdateUserUseCase) {}

  async run(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: 'ID de usuario no válido'
        });
        return;
      }

      // Verificar si hay campos para actualizar
      if (Object.keys(updates).length === 0) {
        res.status(400).json({
          success: false,
          error: 'No se proporcionaron campos para actualizar'
        });
        return;
      }

      await this.updateUserUseCase.run(id, updates);

      res.status(200).json({
        success: true,
        message: `Usuario con ID ${id} actualizado correctamente`
      });

    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({
          success: false,
          error: error.message
        });
      } else {
        console.error('Error en UpdateUserController:', error);
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Error interno al actualizar el usuario'
        });
      }
    }
  }
}