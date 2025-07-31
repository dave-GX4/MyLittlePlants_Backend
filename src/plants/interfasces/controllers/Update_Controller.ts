import { Request, Response } from 'express';
import { NotFoundError } from '../../dominio/entities/valueObject/NotFoundError';
import { UpdatePlantUseCase } from '../../application/Update_UseCase';

export class UpdatePlantController {
  constructor(private readonly updatePlantUseCase: UpdatePlantUseCase) {}

  async run(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;

      console.log('📝 Received request body for update:', req.body);

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: 'ID de planta no válido'
        });
        return;
      }
      
      if (req.file) {
        console.log('🖼️ Received new file for update:', req.file);
        updates.imageUrl = req.file.path;
      }

      // Verificar si hay campos para actualizar
      if (Object.keys(updates).length === 0) {
        res.status(400).json({
          success: false,
          error: 'No se proporcionaron campos para actualizar'
        });
        return;
      }

      await this.updatePlantUseCase.run(id, updates);

      res.status(200).json({
        success: true,
        message: `Planta con ID ${id} actualizado correctamente`
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
          error: error instanceof Error ? error.message : 'Error interno al actualizar la planta'
        });
      }
    }
  }
}