import { UserRepository } from "../domain/User_Repository";
import { NotFoundError } from "../domain/objectValues/NotFoundError";

export class DeleteUserUseCase {
    constructor(private repository: UserRepository) {}

    async run(id: number): Promise<void> {
        // Validación básica del ID
        if (!id || isNaN(id)) {
            throw new Error("ID de usuario no válido");
        }

        const existingUser = await this.repository.getById(id);
        if (!existingUser) {
            throw new NotFoundError(`Usuario con ID ${id} no encontrado`); // Error específico
        }

        await this.repository.delete(id);
    }
}