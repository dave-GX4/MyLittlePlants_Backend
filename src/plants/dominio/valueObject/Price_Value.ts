export class PriceValue {
    value: number;

    constructor(value: number) {
        this.value = value;
        this.isValidPrice();
    }

    private isValidPrice(): void {
        // Validación del precio
        if (this.value < 0) {
            throw new Error("El precio no puede ser negativo.");
        }
    }
}