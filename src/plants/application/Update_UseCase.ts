import { Plant } from "../dominio/entities/Plant";
import { PlantRepository } from "../dominio/Plant_Repository";
import { NameValue } from "../dominio/entities/valueObject/Name_Value";
import { DescriptionValue } from "../dominio/entities/valueObject/Description_Value";
import { ImageUrlValue } from "../dominio/entities/valueObject/ImageUrl_Value";
import { NotFoundError } from "../dominio/entities/valueObject/NotFoundError";
import { WateringFrequencyValue } from "../dominio/entities/valueObject/Watering_Value";
import { SunlightRequirementValue } from "../dominio/entities/valueObject/Sunlight_Value";
import { FertilizationFrequencyValue } from "../dominio/entities/valueObject/Fertilization_Value";
import { TemperatureRangeValue } from "../dominio/entities/valueObject/Temperature_Value";
import { HumidityRequirementValue } from "../dominio/entities/valueObject/Humidity_Value";
import { SoilTypeValue } from "../dominio/entities/valueObject/Soil_Value";
import { ToxicityLevel } from "../dominio/entities/valueObject/Toxocity_Value";
import { PriceValue } from "../dominio/entities/valueObject/Price_Value";
import { HeightValue } from "../dominio/entities/valueObject/Height_Value";

export class UpdatePlantUseCase {
    constructor(private readonly repository: PlantRepository) {}

    async run(id: number, sellerId: number, updates: Partial<{
        name: string;
        description: string;
        ImageUrl: string;
        wateringFrequency: number;
        sunlightRequirement: string;
        fertilizationFrequency: number;
        temperatureRange: string;
        humidityRequirement: string;
        soilType: string;
        toxicityLevel: string;
        price: number;
        height: number;
    }>): Promise<void> {
        const existingPlant = await this.repository.getById(id);
        if (!existingPlant) {
            throw new NotFoundError(`La planta con el id ${id} no ha sido encontrada`);
        }

        if (existingPlant.sellerId !== sellerId) {
            throw new NotFoundError("No tienes permiso para modificar esta planta.");
        }

        const updatedPlant = new Plant(
            updates.name ? new NameValue(updates.name) : existingPlant.name,
            updates.description ? new DescriptionValue(updates.description) : existingPlant.description,
            updates.ImageUrl ? new ImageUrlValue(updates.ImageUrl) : existingPlant.imageUrl,
            updates.wateringFrequency ? new WateringFrequencyValue(updates.wateringFrequency) : existingPlant.wateringFrequency,
            updates.sunlightRequirement ? new SunlightRequirementValue(updates.sunlightRequirement) : existingPlant.sunlightRequirement,
            updates.fertilizationFrequency ? new FertilizationFrequencyValue(updates.fertilizationFrequency) : existingPlant.fertilizationFrequency,
            updates.temperatureRange ? new TemperatureRangeValue(updates.temperatureRange) : existingPlant.temperatureRange,
            updates.humidityRequirement ? new HumidityRequirementValue(updates.humidityRequirement) : existingPlant.humidityRequirement,
            updates.soilType ? new SoilTypeValue(updates.soilType) : existingPlant.soilType,
            updates.toxicityLevel ? new ToxicityLevel(updates.toxicityLevel) : existingPlant.toxicityLevel,
            updates.price ? new PriceValue(updates.price) : existingPlant.price,
            updates.height ? new HeightValue(updates.height) : existingPlant.height,
            existingPlant.sellerId,
            id
        );

        return this.repository.update(updatedPlant);
    }
}