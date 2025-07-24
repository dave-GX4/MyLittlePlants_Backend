import { UserRepository } from "../../domain/User_Repository";
import { UserResponse } from "../DTOs/User_DTO";

export class GetAllUseCase {
    constructor(private readonly repository: UserRepository) {}

    async run(): Promise<UserResponse[]> {
        const users = await this.repository.getAll();
        
        // Convertimos cada entidad User al DTO de respuesta
        return users.map(user => 
            new UserResponse(
                user.id!,
                user.name.value,
                user.email.value,
                user.phone?.value
            )
        );
    }
}