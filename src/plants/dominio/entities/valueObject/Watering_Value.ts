export class WateringFrequencyValue {
    value: number; // in days

    constructor(value: number) {
        this.value = value;
        this.isValidWateringFrequency();
    }

    private isValidWateringFrequency(): void {
        // Validación de frecuencia de riego
        if (this.value < 1 || this.value > 365) {
            throw new Error("La frecuencia de riego debe estar entre 1 y 365 días.");
        }
    }
}