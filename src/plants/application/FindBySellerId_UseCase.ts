import { Plant } from "../dominio/entities/Plant";
import { PlantRepository } from "../dominio/Plant_Repository";

export class GetPlantsBySellerUseCase {
    constructor(private readonly repository: PlantRepository) {}

    async run(sellerId: number): Promise<Plant[]> {
        try {
            // Simplemente llama al método del repositorio que ya definimos
            const plants = await this.repository.findBySellerId(sellerId);
            return plants;
        } catch (error) {
            console.error("Error en GetPlantsBySellerUseCase:", error);
            // Relanza el error para que el controlador lo maneje
            throw error; 
        }
    }
}