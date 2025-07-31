export class FertilizationFrequencyValue {
    value: number; // in weeks

    constructor(value: number) {
        this.value = value;
        this.isValidFertilizationFrequency();
    }

    private isValidFertilizationFrequency(): void {
        // Validación de frecuencia de fertilización
        if (this.value <= 0) {
            throw new Error("La frecuencia de fertilización debe ser un número positivo.");
        }
    }
}