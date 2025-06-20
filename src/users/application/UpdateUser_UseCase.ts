import { User } from "../domain/entities/User";
import { EmailValue } from "../domain/objectValues/Email_Value";
import { NameValue } from "../domain/objectValues/Name_Value";
import { NotFoundError } from "../domain/objectValues/NotFoundError";
import { PasswordValue } from "../domain/objectValues/Password_Value";
import { PhoneValue } from "../domain/objectValues/Phone_Value";
import { UserRepository } from "../domain/User_Repository";

export class UpdateUserUseCase {
    constructor(private repository: UserRepository) {}

    async run(id: number, updates: Partial<{
        name: string;
        email: string;
        phone: string;
        password: string;
    }>): Promise<void> {
        const existingUser = await this.repository.getById(id);
        if (!existingUser) {
            throw new NotFoundError(`El usuario con el id ${id} no ha sido encontrado`);
        }

        // Crear un nuevo usuario con los campos actualizados
        const updatedUser = new User(
            updates.name ? new NameValue(updates.name) : existingUser.name,
            updates.email ? new EmailValue(updates.email) : existingUser.email,
            updates.password ? new PasswordValue(updates.password) : existingUser.password,
            updates.phone !== undefined ? 
                (updates.phone ? new PhoneValue(updates.phone) : undefined) 
                : existingUser.phone,
            id
        );

        return this.repository.update(updatedUser);
    }
}