import { Request, Response } from "express";
import { NotFoundError } from '../../domain/entities/objectValues/NotFoundError';
import { FinedByEmailUseCase } from "../../application/usecases/FinedByEmail_UseCase";

export class FinedByEmailController {
  constructor(
    private readonly finedByEmail: FinedByEmailUseCase
  ) {}

  async run (req: Request, res: Response): Promise<void>{
    try {
      const email = req.params.email;

      if (!email) {
        res.status(400).json({
            success: false,
            error: 'Email parameter is required'
        });
        return;
      }

      // Ejecutar el caso de uso que ahora devuelve un UserResponse
      const userResponse = await this.finedByEmail.run(email);

      if (userResponse) {
        res.status(200).json({
          success: true,
          data: userResponse // Usamos el DTO directamente
        });
      } else {
        res.status(404).json({
          success: false,
          error: `User with email ${email} not found`
        });
      }
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({
          success: false,
          error: error.message
        });
      } else {
        console.error('Error in FindByEmailController:', error);
        res.status(500).json({
          success: false,
          error: 'Internal server error while fetching user by email'
        });
      }
    }
  }
}