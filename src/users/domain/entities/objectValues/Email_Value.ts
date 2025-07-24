export class EmailValue {
    value: string;

    constructor(value: string) {
        this.value = value;
        this.validateEmail();
    }

    private validateEmail() {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        
        if (!emailRegex.test(this.value)) {
            throw new Error("El correo electrónico no tiene un formato válido.");
        }
    }
}