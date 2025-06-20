import { Request, Response } from 'express';
import { GetAllUseCase } from '../../application/GetAll_UseCase';


export class GetAllController {
  constructor(private readonly getAllUseCase: GetAllUseCase) {}

  async run(req: Request, res: Response): Promise<void> {
    try {
      // Ejecutar el caso de uso
      const users = await this.getAllUseCase.run();

      // Mapear los usuarios a DTOs (Data Transfer Objects) para la respuesta
      const usersResponse = users.map(user => ({
        name: user.name.value,
        email: user.email.value,
        phone: user.phone?.value ?? null,
        // Nunca devolver la contraseña en la respuesta
      }));

      res.status(200).json({
        success: true,
        data: usersResponse
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