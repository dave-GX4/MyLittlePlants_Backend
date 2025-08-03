import { Plant } from "./entities/Plant";

export interface PlantRepository {
    getAll(): Promise<Plant[]>;
    getById(id: number): Promise<Plant>;
    addPlant(plant: Plant): Promise<void>;
    findBySellerId(sellerId: number): Promise<Plant[]>;
    update(plant: Plant): Promise<void>;
    delete(id: number): Promise<void>;
    search(query: string): Promise<Plant[]>;
}