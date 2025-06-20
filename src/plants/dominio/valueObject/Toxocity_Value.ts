export class ToxicityLevel {
    value: string;

    constructor(value: string) {
        this.value = value;
        this.isValidToxicityLevel();
    }

    private isValidToxicityLevel(): void {
        // Validación del nivel de toxicidad
        const validToxicityLevels = ["Non-toxic", "Mildly Toxic", "Highly Toxic"];
        if (!validToxicityLevels.includes(this.value)) {
            throw new Error(`El nivel de toxicidad debe ser uno de los siguientes: ${validToxicityLevels.join(", ")}`);
        }
    }
}