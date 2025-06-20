import { User } from "../domain/entities/User";
import { UserRepository } from "../domain/User_Repository";

export class GetAllUseCase {
    constructor(private repository: UserRepository) {}

    async run(): Promise<User[]> {
        return this.repository.getAll();
    }
}