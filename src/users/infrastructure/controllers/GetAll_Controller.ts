import { Request, Response } from 'express';
import { GetAllUseCase } from '../../application/usecases/GetAll_UseCase';

export class GetAllController {
  constructor(private readonly getAllUseCase: GetAllUseCase) {}

  async run(req: Request, res: Response): Promise<void> {
    try {
      // Ejecutar el caso de uso que ahora devuelve UserResponse[]
      const usersResponse = await this.getAllUseCase.run();

      res.status(200).json({
        success: true,
        data: usersResponse // Usamos el array de DTOs directamente
      });
    } catch (error) {
      console.error('Error in GetAllController:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error while fetching users'
      });
    }
  }
}