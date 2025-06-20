import { User } from "../domain/entities/User";
import { UserRepository } from "../domain/User_Repository";
import { NameValue } from "../domain/objectValues/Name_Value";
import { EmailValue } from "../domain/objectValues/Email_Value";
import { PhoneValue } from "../domain/objectValues/Phone_Value";
import { PasswordValue } from "../domain/objectValues/Password_Value";

export class CreateUserUseCase {
    constructor(private repository: UserRepository) {}

    async run(name: string, email: string, phone: string, password: string): Promise<void> {
        try {
            console.log('Creating user with data:', { name, email, phone });
            
            const user = new User(
                new NameValue(name),
                new EmailValue(email),
                new PasswordValue(password),
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