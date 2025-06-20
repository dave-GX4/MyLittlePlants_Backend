export class PasswordValue {
    value: string;

    constructor(value: string) {
        this.value = value;
        this.validatePassword();
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
}