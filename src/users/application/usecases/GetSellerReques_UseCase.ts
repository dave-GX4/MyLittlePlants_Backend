import { User } from "../../domain/entities/User";
import { UserRepository } from "../../domain/User_Repository";
import { UserResponse } from "../DTOs/User_DTO";

export class GetSellerRequestsUseCase {
    constructor(private readonly repository: UserRepository) {}

    async run(): Promise<UserResponse[]> {
        const users: User[] = await this.repository.getSellerRequests();

        // 2. Si no hay usuarios, devuelve un array vacío.
        if (!users || users.length === 0) {
            return [];
        }
        return users.map(user => {
            
            // Creamos un objeto literal que cumple con la forma de la interfaz UserResponse.
            const userResponse: UserResponse = {
                id: user.id!,
                name: user.name.value,
                email: user.email.value,
                role: user.role.value,
                wantsToBeSeller: user.wantsToBeSeller, 
                phone: user.phone?.value
            };
            
            return userResponse;
        });
    }
}