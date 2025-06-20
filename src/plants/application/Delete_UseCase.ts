import { PlantRepository } from "../dominio/Plant_Repository";
import { NotFoundError } from "../dominio/valueObject/NotFoundError";

export class DeletePlantUseCase {
    constructor(private readonly repository: PlantRepository) {}

    async run(id: number): Promise<void> {
        // Validación básica del ID
        if (!id || isNaN(id)) {
            throw new Error("ID de planta no válida");
        }

        const existingUser = await this.repository.getById(id);
        if (!existingUser) {
            throw new NotFoundError(`Planta con ID ${id} no encontrado`); // Error específico
        }

        await this.repository.delete(id);
    }
}