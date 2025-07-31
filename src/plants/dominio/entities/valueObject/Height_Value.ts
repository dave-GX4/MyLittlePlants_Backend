export class HeightValue {
    value: number;

    constructor(value: number) {
        this.value = value;
        this.isValidHeight();
    }

    private isValidHeight(): void {
        // Validación de la altura
        if (this.value < 0 || this.value > 1000) { // Asumiendo que la altura no puede ser negativa ni excesivamente alta
            throw new Error("La altura debe estar entre 0 y 1000 cm.");
        }
    }
}