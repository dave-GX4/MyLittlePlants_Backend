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
        // Expresión regular que acepta letras (mayúsculas y minúsculas), espacios y caracteres acentuados
        const re = /^[a-zA-Z\u00C0-\u00FF\s]+$/;
        if (!re.test(this.value)) {
            throw new Error("Solo se acepta letras, espacios y caracteres acentuados en el nombre de usuario.");
        }

        if (this.value.length > 0 && !/^[A-Z\u00C0-\u00D6\u00D8-\u00DE]/.test(this.value)) {
            throw new Error("El nombre debe comenzar con una letra mayúscula (incluyendo mayúsculas acentuadas).");
        }
    }
}