import { PlantRepository } from "../dominio/Plant_Repository";
import { Plant } from "../dominio/entities/Plant";

export class SearchPlantUseCase {
  constructor(private readonly repository: PlantRepository) {}

  async run(query: string): Promise<Plant[]> {
    return this.repository.search(query);
  }
}
