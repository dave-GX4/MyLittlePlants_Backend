import { Request, Response } from 'express';
import { UpdateUserRoleUseCase } from '../../application/usecases/UpdateRole_UseCase';
import { NotFoundError } from '../../domain/entities/objectValues/NotFoundError';

export class UpdateUserRoleController {
    constructor(private readonly updateUserRoleUseCase: UpdateUserRoleUseCase) {}

    async run(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const { role } = req.body;

            if (isNaN(id) || !role) {
                res.status(400).json({ success: false, error: 'Se requiere un ID de usuario válido y un rol.' });
                return;
            }

            await this.updateUserRoleUseCase.run(id, role);

            res.status(200).json({ success: true, message: `Rol del usuario con ID ${id} actualizado a ${role}.` });

        } catch (error) {
            if (error instanceof NotFoundError) {
                res.status(404).json({ success: false, error: error.message });
            } else {
                // Captura errores de validación de RoleValue (ej. "rol inválido")
                res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'Error interno.' });
            }
        }
    }
}