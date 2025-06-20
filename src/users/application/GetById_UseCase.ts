import { User } from "../domain/entities/User";
import { NotFoundError } from "../domain/objectValues/NotFoundError";
import { UserRepository } from "../domain/User_Repository";

export class GetByIdUseCase {
    constructor(private repository: UserRepository) {}

    async run(id: number): Promise<User> {
        const user = await this.repository.getById(id);

        if (!user) throw new NotFoundError(`User with id ${id} not found`);
        
        return this.repository.getById(id);
    }
}