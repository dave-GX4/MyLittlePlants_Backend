export class DescriptionValue {
    value: string;

    constructor(value: string) {
        this.value = value;
        this.isValidDescription();
    }

    private isValidDescription(): void {
        // Validación de longitud mínima y máxima
        if (this.value.length < 10 || this.value.length > 500) {
            throw new Error("La descripción debe tener entre 10 y 500 caracteres.");
        }

        // Validación de caracteres permitidos
        const validCharacters = /^[a-zA-Z0-9\s.,;:!?'"()\-]+$/;
        if (!validCharacters.test(this.value)) {
            throw new Error("La descripción contiene caracteres no permitidos.");
        }
    }
}