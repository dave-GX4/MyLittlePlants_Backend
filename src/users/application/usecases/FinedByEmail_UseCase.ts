import { UserRepository } from "../../domain/User_Repository";
import { UserResponse } from "../DTOs/User_DTO";

export class FinedByEmailUseCase {
    constructor(private readonly repository: UserRepository) {}

    async run(email: string): Promise<UserResponse | null> {
        const user = await this.repository.finedByEmail(email);

        if (!user) {
            console.warn(`User with email ${email} not found`);
            return null;
        }

        // Convertimos la entidad User al DTO de respuesta
        return new UserResponse(
            user.id!,
            user.name.value,
            user.email.value,
            user.admins,
            user.phone?.value
        );
    }
}