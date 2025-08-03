import { Plant } from "../dominio/entities/Plant";
import { PlantRepository } from "../dominio/Plant_Repository";
import { DescriptionValue } from "../dominio/entities/valueObject/Description_Value";
import { FertilizationFrequencyValue } from "../dominio/entities/valueObject/Fertilization_Value";
import { HeightValue } from "../dominio/entities/valueObject/Height_Value";
import { HumidityRequirementValue } from "../dominio/entities/valueObject/Humidity_Value";
import { ImageUrlValue } from "../dominio/entities/valueObject/ImageUrl_Value";
import { NameValue } from "../dominio/entities/valueObject/Name_Value";
import { PriceValue } from "../dominio/entities/valueObject/Price_Value";
import { SoilTypeValue } from "../dominio/entities/valueObject/Soil_Value";
import { SunlightRequirementValue } from "../dominio/entities/valueObject/Sunlight_Value";
import { TemperatureRangeValue } from "../dominio/entities/valueObject/Temperature_Value";
import { ToxicityLevel } from "../dominio/entities/valueObject/Toxocity_Value";
import { WateringFrequencyValue } from "../dominio/entities/valueObject/Watering_Value";

export class AddPlantUseCase {
    constructor(private readonly repository: PlantRepository) {}

    async run(
        name: string,
        description: string,
        imageUrl: string,
        wateringFrequency: number,
        sunlightRequirement: string,
        fertilizationFrequency: number,
        temperatureRange: string,
        humidityRequirement: string,
        soilType: string,
        toxicityLevel: string,
        price: number,
        height: number,
        sellerId: number
    ): Promise<void> {
        try {
            console.log('Creating user with data:', {name, description, imageUrl, wateringFrequency, sunlightRequirement, fertilizationFrequency, temperatureRange, humidityRequirement, soilType, toxicityLevel, price, height});
            
            const plant = new Plant(
                new NameValue(name),
                new DescriptionValue(description),
                new ImageUrlValue(imageUrl),
                new WateringFrequencyValue(wateringFrequency),
                new SunlightRequirementValue(sunlightRequirement),
                new FertilizationFrequencyValue(fertilizationFrequency),
                new TemperatureRangeValue(temperatureRange),
                new HumidityRequirementValue(humidityRequirement),
                new SoilTypeValue(soilType),
                new ToxicityLevel(toxicityLevel),
                new PriceValue(price),
                new HeightValue(height),
                sellerId
            );

            await this.repository.addPlant(plant);
            console.log('Planta creado con éxito:', plant);
        } catch (error) {
            console.error('Error en crear planta en UseCase:', error);
            throw error;
        }
    }
}