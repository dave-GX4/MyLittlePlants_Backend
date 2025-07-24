import { NotFoundError } from "../../domain/entities/objectValues/NotFoundError";
import { UserRepository } from "../../domain/User_Repository";
import { UserResponse } from "../DTOs/User_DTO";

export class GetByIdUseCase {
    constructor(private readonly repository: UserRepository) {}

    async run(id: number): Promise<UserResponse> {
        const user = await this.repository.getById(id);

        if (!user) throw new NotFoundError(`User with id ${id} not found`);
        
        // Convertimos la entidad User al DTO de respuesta
        return new UserResponse(
            user.id!,
            user.name.value,
            user.email.value,
            user.phone?.value
        );
    }
}