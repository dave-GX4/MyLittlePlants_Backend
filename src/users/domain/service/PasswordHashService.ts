import bcrypt from 'bcrypt';

export interface IPasswordHashService {
    hash(plainPassword: string): Promise<string>;
    compare(plainPassword: string, hashedPassword: string): Promise<boolean>;
}

export class PasswordHashService implements IPasswordHashService {
    private readonly saltRounds = 12;

    async hash(plainPassword: string): Promise<string> {
        return await bcrypt.hash(plainPassword, this.saltRounds);
    }

    async compare(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
}