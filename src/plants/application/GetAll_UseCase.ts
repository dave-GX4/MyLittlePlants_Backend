import { Plant } from "../dominio/entities/Plant";
import { PlantRepository } from "../dominio/Plant_Repository";

export class GetAllUseCase {
    constructor(private readonly repository: PlantRepository) {}

    async run(): Promise<Plant[]> {
        return this.repository.getAll();
    }
}