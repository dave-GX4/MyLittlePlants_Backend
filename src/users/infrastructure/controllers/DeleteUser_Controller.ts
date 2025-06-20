import { Request, Response } from 'express';
import { DeleteUserUseCase } from '../../application/DeleteUser_UseCase';

export class DeleteUserController {
  constructor(
    private deleteUserUseCase: DeleteUserUseCase) {}

  async run(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      // Validar que el ID sea un número válido
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: 'ID de usuario no válido'
        });
        return;
      }

      // Ejecutar el caso de uso
      await this.deleteUserUseCase.run(id);

      // Respuesta exitosa
      res.status(200).json({
        success: true,
        message: `Usuario con ID ${id} eliminado correctamente`
      });

    } catch (error) {
      // Manejo específico de errores
      if (error instanceof Error && error.message.includes('no ha sido encontrado')) {
        res.status(404).json({
          success: false,
          error: error.message
        });
      } else {
        console.error('Error en DeleteUserController:', error);
        res.status(500).json({
          success: false,
          error: 'Error interno al eliminar el usuario'
        });
      }
    }
  }
}