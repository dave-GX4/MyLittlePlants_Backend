import { User } from "./entities/User";

export interface UserRepository {
    getById(id: number): Promise<User>;
    getAll(): Promise<User[]>;
    create(user: User): Promise<void>;
    delete(id: number): Promise<void>;
    update(user: User): Promise<void>;
}