import { NotFoundError } from "../../../plants/dominio/entities/valueObject/NotFoundError";
import { UserRepository } from "../../domain/User_Repository";
import { UserResponse } from "../DTOs/User_DTO";

export class FinedByEmailUseCase {
    constructor(private readonly repository: UserRepository) {}

    async run(email: string): Promise<UserResponse> {
        const user = await this.repository.finedByEmail(email);

        if (!user) {
            throw new NotFoundError(`User with email ${email} not found`);
        }

        const userResponse: UserResponse = {
            id: user.id!,
            name: user.name.value,
            email: user.email.value,
            role: user.role.value,
            wantsToBeSeller: user.wantsToBeSeller,
            phone: user.phone?.value
        };

        return userResponse;
    }
}