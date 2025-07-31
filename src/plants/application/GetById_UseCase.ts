import { Plant } from "../dominio/entities/Plant";
import { PlantRepository } from "../dominio/Plant_Repository";
import { NotFoundError } from "../dominio/entities/valueObject/NotFoundError";

export class GetByIdUseCase {
    constructor(private readonly repository: PlantRepository) {}

    async run(id: number): Promise<Plant> {
        const plant = await this.repository.getById(id);

        if (!plant) throw new NotFoundError(`Planta con el id ${id} no encontrado`);
        
        return this.repository.getById(id);
    }
}