import { RoleValue } from "./entities/objectValues/Role_Value";
import { User } from "./entities/User";

export interface UserRepository {
    getById(id: number): Promise<User | null>
    finedByEmail(email: string): Promise<User | null>;
    getAll(): Promise<User[]>;
    getSellerRequests(): Promise<User[]>;
    create(user: User): Promise<void>;
    delete(id: number): Promise<void>;
    update(id: number, user: User): Promise<void>;
    updateRole(id: number, role: RoleValue): Promise<void>;
    updateSellerRequestStatus(id: number, status: boolean): Promise<void>;
}