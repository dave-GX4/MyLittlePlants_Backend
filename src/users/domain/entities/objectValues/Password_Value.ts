export class PasswordValue {
    value: string;
    private isHashed: boolean;

    constructor(value: string, isHashed: boolean = false) {
        this.value = value;
        this.isHashed = isHashed;
        
        // Solo validar si no está hasheada (es una contraseña nueva)
        if (!isHashed) {
            this.validatePassword();
        }
    }

    private validatePassword() {
        const hasUpperCase = /[A-Z]/.test(this.value);
        const hasLowerCase = /[a-z]/.test(this.value);
        const hasNumber = /\d/.test(this.value);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(this.value);
        
        if (this.value.length < 8) {
            throw new Error("La contraseña debe tener al menos 8 caracteres.");
        }
        if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
            throw new Error("La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial.");
        }
    }

    // Método para crear una instancia con contraseña ya hasheada
    static fromHashed(hashedPassword: string): PasswordValue {
        return new PasswordValue(hashedPassword, true);
    }

    // Método para saber si la contraseña está hasheada
    getIsHashed(): boolean {
        return this.isHashed;
    }

    // Método para marcar la contraseña como hasheada después del hash
    markAsHashed(): void {
        this.isHashed = true;
    }
}