import { Request, Response } from "express";
import { NotFoundError } from '../../domain/objectValues/NotFoundError';
import { FinedByEmailUseCase } from "../../application/FinedByEmail_UseCase";

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

      // Ejecutar el caso de uso
      const user = await this.finedByEmail.run(email);

      // Convertir a DTO para la respuesta
      if (user) {
        const userResponse = {
          id: user.id,
          name: user.name.value,
          email: user.email.value,
          phone: user.phone?.value ?? null
          // Excluir información sensible como password
        };

        res.status(200).json({
          success: true,
          data: userResponse
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