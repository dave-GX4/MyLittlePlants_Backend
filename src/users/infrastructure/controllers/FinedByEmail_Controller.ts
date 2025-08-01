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
        res.status(400).json({ success: false, error: 'El correo es requerido' });
        return;
      }

      // El caso de uso ahora SIEMPRE devuelve un usuario o lanza un error.
      // Ya no necesitamos comprobar si es null.
      const userResponse = await this.finedByEmail.run(email);

      res.status(200).json({
          success: true,
          data: userResponse
      });
      
    } catch (error) {
      // La lógica de errores es idéntica a la de GetByIdController.
      if (error instanceof NotFoundError) {
        res.status(404).json({ success: false, error: error.message });
      } else {
        console.error('Error en FinedByEmailController:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
      }
    }
  }
}