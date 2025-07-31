export class TemperatureRangeValue {
    value: string;

    constructor(value: string) {
        this.value = value;
        this.isValidTemperatureRange();
    }

    private isValidTemperatureRange(): void {
        // Validación de formato de rango de temperatura
        const validFormat = /^\d{1,3}-\d{1,3}°C$/;
        if (!validFormat.test(this.value)) {
            throw new Error("El rango de temperatura debe tener el formato 'X-Y°C', donde X e Y son números.");
        }

        // Validación de valores numéricos
        const [min, max] = this.value.replace('°C', '').split('-').map(Number);
        if (min < -50 || max > 100 || min >= max) {
            throw new Error("El rango de temperatura debe estar entre -50°C y 100°C, y el valor mínimo debe ser menor que el máximo.");
        }
    }
}