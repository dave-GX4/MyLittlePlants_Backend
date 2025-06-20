export class HumidityRequirementValue {
    value: string;

    constructor(value: string) {
        this.value = value;
        this.isValidHumidity();
    }

    private isValidHumidity(): void {
        // Validación básica de formato de humedad
        const humidityPattern = /^(0|[1-9][0-9]?|100)%$/;
        if (!humidityPattern.test(this.value)) {
            throw new Error("El valor de humedad debe estar entre 0% y 100%.");
        }
    }
}