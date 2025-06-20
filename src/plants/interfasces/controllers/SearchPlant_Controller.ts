import { Request, Response } from 'express';
import { SearchPlantUseCase } from '../../application/SearchPlant_UseCase';

export class SearchPlantController {
  constructor(private readonly searchPlantUseCase: SearchPlantUseCase) {}

  async run(req: Request, res: Response): Promise<void> {
    try {
      const query = req.query.q?.toString();
      if (!query) {
        res.status(400).json({ success: false, error: 'Falta el parámetro de búsqueda' });
        return;
      }

      const results = await this.searchPlantUseCase.run(query);

      res.status(200).json({
        success: true,
        results
      });

    } catch (error) {
      console.error('Error en SearchPlantController:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error interno'
      });
    }
  }
}
