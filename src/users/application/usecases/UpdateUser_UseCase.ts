import { User } from "../../domain/entities/User";
import { EmailValue } from "../../domain/entities/objectValues/Email_Value";
import { NameValue } from "../../domain/entities/objectValues/Name_Value";
import { NotFoundError } from "../../domain/entities/objectValues/NotFoundError";
import { PasswordValue } from "../../domain/entities/objectValues/Password_Value";
import { PhoneValue } from "../../domain/entities/objectValues/Phone_Value";
import { UserRepository } from "../../domain/User_Repository";
import { IPasswordHashService } from "../../domain/service/PasswordHashService";

export class UpdateUserUseCase {
    constructor(
        private readonly repository: UserRepository,
        private readonly passwordHashService: IPasswordHashService
    ) {}

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

        // Manejar la actualización de contraseña si se proporciona
        let updatedPasswordValue = existingUser.password;
        if (updates.password) {
            // Validar la nueva contraseña creando un PasswordValue temporal
            new PasswordValue(updates.password);
            
            // Hashear la nueva contraseña
            const hashedPassword = await this.passwordHashService.hash(updates.password);
            updatedPasswordValue = PasswordValue.fromHashed(hashedPassword);
        }

        // Crear un nuevo usuario con los campos actualizados
        const updatedUser = new User(
            updates.name ? new NameValue(updates.name) : existingUser.name,
            updates.email ? new EmailValue(updates.email) : existingUser.email,
            updatedPasswordValue,
            updates.phone !== undefined ? 
                (updates.phone ? new PhoneValue(updates.phone) : undefined) 
                : existingUser.phone,
            id
        );

        return this.repository.update(updatedUser);
    }
}