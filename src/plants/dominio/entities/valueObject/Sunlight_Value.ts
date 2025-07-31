export class SunlightRequirementValue {
    value: string;

    constructor(value: string) {
        this.value = value;
        this.isValidSunlightRequirement();
    }

    private isValidSunlightRequirement(): void {
        // Validación de requisitos de luz solar
        const validRequirements = ["Full Sun", "Partial Shade", "Full Shade", "Luz indirecta brillante"];
        if (!validRequirements.includes(this.value)) {
            throw new Error("El requisito de luz solar debe ser 'Full Sun', 'Partial Shade' o 'Full Shade'.");
        }
    }
}