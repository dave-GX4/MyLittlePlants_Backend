export class HumidityRequirementValue {
    value: string;

    constructor(value: string) {
        this.value = value;
        this.isValidHumidity();
    }

    private isValidHumidity(): void {
        // 1. Nueva expresión regular para validar el formato "numero-numero%"
        //    Ambos números deben estar entre 0 y 100.
        const humidityRangePattern = /^(0|[1-9][0-9]?|100)-(0|[1-9][0-9]?|100)%$/;
        
        if (!humidityRangePattern.test(this.value)) {
            throw new Error("El formato de humedad es inválido. Se espera un rango como '40-60%'.");
        }

        // 2. Validación lógica adicional: el primer número no puede ser mayor que el segundo.
        const parts = this.value.replace('%', '').split('-');
        const lowerBound = parseInt(parts[0], 10);
        const upperBound = parseInt(parts[1], 10);

        if (lowerBound > upperBound) {
            throw new Error("El rango de humedad es inválido: el primer valor no puede ser mayor que el segundo.");
        }
    }
}