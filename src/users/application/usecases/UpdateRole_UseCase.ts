import { UserRepository } from "../../domain/User_Repository";
import { NotFoundError } from "../../domain/entities/objectValues/NotFoundError";
import { RoleValue } from "../../domain/entities/objectValues/Role_Value";

export class UpdateUserRoleUseCase {
    constructor(private readonly repository: UserRepository) {}

    async run(id: number, newRole: string): Promise<void> {
        const userExists = await this.repository.getById(id);
        if (!userExists) {
            throw new NotFoundError(`El usuario con el id ${id} no ha sido encontrado.`);
        }

        const validRole = new RoleValue(newRole);

        // Llamamos al método que cambia el rol.
        await this.repository.updateRole(id, validRole);

        // Si el nuevo rol es 'Vendedor', asumimos que la solicitud ha sido procesada.
        // Y actualizamos el estado de la solicitud a 'false'.
        if (newRole === 'Vendedor') {
            await this.repository.updateSellerRequestStatus(id, false);
        }
    }
}