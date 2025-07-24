import { User } from "../../domain/entities/User";
import { UserRepository } from "../../domain/User_Repository";
import { NameValue } from "../../domain/entities/objectValues/Name_Value";
import { EmailValue } from "../../domain/entities/objectValues/Email_Value";
import { PhoneValue } from "../../domain/entities/objectValues/Phone_Value";
import { PasswordValue } from "../../domain/entities/objectValues/Password_Value";
import { IPasswordHashService } from "../../domain/service/PasswordHashService";

export class CreateUserUseCase {
    constructor(
        private readonly repository: UserRepository,
        private readonly passwordHashService: IPasswordHashService
    ) {}

    async run(name: string, email: string, phone: string, password: string): Promise<void> {
        try {
            // Hashear la contraseña
            const hashedPassword = await this.passwordHashService.hash(password);
            
            // Crear un nuevo PasswordValue con la contraseña hasheada
            const hashedPasswordValue = PasswordValue.fromHashed(hashedPassword);

            const user = new User(
                new NameValue(name),
                new EmailValue(email),
                hashedPasswordValue,
                phone ? new PhoneValue(phone) : undefined
            );

            await this.repository.create(user);
            console.log('User created in repository successfully');
        } catch (error) {
            console.error('Error in CreateUserUseCase:', error);
            throw error;
        }
    }
}