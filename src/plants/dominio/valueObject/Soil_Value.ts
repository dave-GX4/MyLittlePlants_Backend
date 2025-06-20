export class SoilTypeValue {
    value: string;

    constructor(value: string) {
        this.value = value;
        this.isValidSoilType();
    }

    private isValidSoilType(): void {
        // Validación del tipo de suelo
        const validSoilTypes = ["Loamy", "Sandy", "Clay", "Peaty", "Saline", "Chalky", "Tierra suelta y bien drenada"];
        if (!validSoilTypes.includes(this.value)) {
            throw new Error(`El tipo de suelo debe ser uno de los siguientes: ${validSoilTypes.join(", ")}`);
        }
    }

}