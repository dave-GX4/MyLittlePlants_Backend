import { NotFoundError } from "../../domain/entities/objectValues/NotFoundError";
import { UserRepository } from "../../domain/User_Repository";
import { UserResponse } from "../DTOs/User_DTO";

export class GetByIdUseCase {
    constructor(private readonly repository: UserRepository) {}

    async run(id: number): Promise<UserResponse> {
        const user = await this.repository.getById(id);

        if (!user) {
            throw new NotFoundError(`User with id ${id} not found`);
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