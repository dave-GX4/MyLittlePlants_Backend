export class NameValue {
    value: string;

    constructor(value: string) {
        this.value = value;
        this.isValidName();
        this.regexName();
    }

    private isValidName(){
        if (this.value.length < 3) {
            throw new Error("El nombre debe tener almenos 3 caracteres.");
        }
    }

    private regexName(){
        const re = /^[a-zA-Z\s]+$/;
        if (!re.test(this.value)) {
            throw new Error("Solo se acepta letras y espacios.");
        }

        if (this.value.length > 0 && !/^[A-Z]/.test(this.value)) {
            throw new Error("El nombre debe comenzar con una letra mayúscula.");
        }
    }
}