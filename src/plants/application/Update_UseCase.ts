import { Plant } from "../dominio/entities/Plant";
import { PlantRepository } from "../dominio/Plant_Repository";
import { NameValue } from "../dominio/valueObject/Name_Value";
import { DescriptionValue } from "../dominio/valueObject/Description_Value";
import { ImageUrlValue } from "../dominio/valueObject/ImageUrl_Value";
import { NotFoundError } from "../dominio/valueObject/NotFoundError";
import { WateringFrequencyValue } from "../dominio/valueObject/Watering_Value";
import { SunlightRequirementValue } from "../dominio/valueObject/Sunlight_Value";
import { FertilizationFrequencyValue } from "../dominio/valueObject/Fertilization_Value";
import { TemperatureRangeValue } from "../dominio/valueObject/Temperature_Value";
import { HumidityRequirementValue } from "../dominio/valueObject/Humidity_Value";
import { SoilTypeValue } from "../dominio/valueObject/Soil_Value";
import { ToxicityLevel } from "../dominio/valueObject/Toxocity_Value";
import { PriceValue } from "../dominio/valueObject/Price_Value";
import { HeightValue } from "../dominio/valueObject/Height_Value";

export class UpdatePlantUseCase {
    constructor(private readonly repository: PlantRepository) {}

    async run(id: number, updates: Partial<{
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
            throw new NotFoundError(`La planta con el id ${id} no ha sido encontrado`);
        }

        // Crear un nuevo usuario con los campos actualizados
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
            id
        );

        return this.repository.update(updatedPlant);
    }
}