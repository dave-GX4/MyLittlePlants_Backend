import { User } from "../domain/entities/User";
import { UserRepository } from "../domain/User_Repository";

export class FinedByEmailUseCase {
    constructor(private readonly repository: UserRepository) {}

    async run(email: string): Promise<User | null> {
        const user = await this.repository.finedByEmail(email);

        if (!user) {
            console.warn(`User with email ${email} not found`);
            return null;
        }

        return user;
    }
}