import { DescriptionValue } from "./valueObject/Description_Value";
import { FertilizationFrequencyValue } from "./valueObject/Fertilization_Value";
import { HeightValue } from "./valueObject/Height_Value";
import { HumidityRequirementValue } from "./valueObject/Humidity_Value";
import { ImageUrlValue } from "./valueObject/ImageUrl_Value";
import { NameValue } from "./valueObject/Name_Value";
import { PriceValue } from "./valueObject/Price_Value";
import { SoilTypeValue } from "./valueObject/Soil_Value";
import { SunlightRequirementValue } from "./valueObject/Sunlight_Value";
import { TemperatureRangeValue } from "./valueObject/Temperature_Value";
import { ToxicityLevel } from "./valueObject/Toxocity_Value";
import { WateringFrequencyValue } from "./valueObject/Watering_Value";

export class Plant {
    id?: number;
    name: NameValue;
    description: DescriptionValue;
    imageUrl: ImageUrlValue;
    wateringFrequency: WateringFrequencyValue; // in days
    sunlightRequirement: SunlightRequirementValue; // e.g., " ", "Partial Shade"
    fertilizationFrequency: FertilizationFrequencyValue; // in weeks
    temperatureRange: TemperatureRangeValue; // e.g., "15-25°C"
    humidityRequirement: HumidityRequirementValue; // e.g., "40-60%"
    soilType: SoilTypeValue; // e.g., "Loamy", "Sandy"
    toxicityLevel: ToxicityLevel; // e.g., "Non-toxic", "Mildly Toxic", "Highly Toxic"
    price: PriceValue; // in local currency
    height: HeightValue; // in cm
    sellerId: number;

    constructor(
        name: NameValue,
        description: DescriptionValue, 
        imageUrl: ImageUrlValue, 
        wateringFrequency: WateringFrequencyValue,
        sunlightRequirement: SunlightRequirementValue,
        fertilizationFrequency: FertilizationFrequencyValue,
        temperatureRange: TemperatureRangeValue,
        humidityRequirement: HumidityRequirementValue,
        soilType: SoilTypeValue,
        toxicityLevel: ToxicityLevel,
        price: PriceValue,
        height: HeightValue,
        sellerId: number,
        id?: number
    
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.imageUrl = imageUrl;
        this.wateringFrequency = wateringFrequency;
        this.sunlightRequirement = sunlightRequirement;
        this.fertilizationFrequency = fertilizationFrequency;
        this.temperatureRange = temperatureRange;
        this.humidityRequirement = humidityRequirement;
        this.soilType = soilType;
        this.toxicityLevel = toxicityLevel;
        this.price = price;
        this.height = height;
        this.sellerId = sellerId;
    }
}