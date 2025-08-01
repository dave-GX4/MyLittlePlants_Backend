import { UserRepository } from "../../domain/User_Repository";
import { NotFoundError } from "../../domain/entities/objectValues/NotFoundError";
import { RoleValue } from "../../domain/entities/objectValues/Role_Value";

export class UpdateUserRoleUseCase {
    constructor(private readonly repository: UserRepository) {}

    async run(id: number, newRole: string): Promise<void> {
        const userExists = await this.repository.getById(id);
        if (!userExists) {
            throw new NotFoundError(`El usuario con el id ${id} no ha sido encontrado para actualizar su rol.`);
        }

        const validRole = new RoleValue(newRole);

        await this.repository.updateRole(id, validRole);
    }
}