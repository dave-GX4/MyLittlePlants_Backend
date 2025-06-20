import { MySQLClient } from "../../../core/db_MySQL";
import { Plant } from "../../dominio/entities/Plant";
import { PlantRepository } from "../../dominio/Plant_Repository";
import { DescriptionValue } from "../../dominio/valueObject/Description_Value";
import { FertilizationFrequencyValue } from "../../dominio/valueObject/Fertilization_Value";
import { HeightValue } from "../../dominio/valueObject/Height_Value";
import { HumidityRequirementValue } from "../../dominio/valueObject/Humidity_Value";
import { ImageUrlValue } from "../../dominio/valueObject/ImageUrl_Value";
import { NameValue } from "../../dominio/valueObject/Name_Value";
import { NotFoundError } from "../../dominio/valueObject/NotFoundError";
import { PriceValue } from "../../dominio/valueObject/Price_Value";
import { SoilTypeValue } from "../../dominio/valueObject/Soil_Value";
import { SunlightRequirementValue } from "../../dominio/valueObject/Sunlight_Value";
import { TemperatureRangeValue } from "../../dominio/valueObject/Temperature_Value";
import { ToxicityLevel } from "../../dominio/valueObject/Toxocity_Value";
import { WateringFrequencyValue } from "../../dominio/valueObject/Watering_Value";

export class PlantMySQLRepository implements PlantRepository {
  private async getConnection() {
    return await MySQLClient.getInstance();
  }

  async addPlant(plant: Plant): Promise<void> {
      const connection = await this.getConnection();
        
      try {
          console.log('plantilla de planta:', {
            name: plant.name.value,
            description: plant.description.value,
            imageUrl: plant.imageUrl.value,
            wateringFrequency: plant.wateringFrequency.value,
            sunlightRequirement: plant.sunlightRequirement.value,
            fertilizationFrequency: plant.fertilizationFrequency.value,
            temperatureRange: plant.temperatureRange.value,
            humidityRequirement: plant.humidityRequirement.value,
            soilType: plant.soilType.value,
            toxicityLevel: plant.toxicityLevel.value,
            price: plant.price.value,
            height: plant.height.value,
          });
  
          await connection.execute(
              `INSERT INTO plants (name, description, imageUrl, wateringFrequency, sunlightRequirement, fertilizationFrequency, temperatureRange, humidityRequirement, soilType, toxicityLevel, price, height) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
              [
                plant.name.value,
                plant.description.value,
                plant.imageUrl.value,
                plant.wateringFrequency.value,
                plant.sunlightRequirement.value,
                plant.fertilizationFrequency.value,
                plant.temperatureRange.value,
                plant.humidityRequirement.value,
                plant.soilType.value,
                plant.toxicityLevel.value,
                plant.price.value,
                plant.height.value,
              ]
          );
          console.log('La planta se creó correctamente en la base de datos');
      } catch (error) {
          console.error("Error al crear la planta en MySQL:", error);
          if (error instanceof Error) {
              throw new Error(`Database error: ${error.message}`);
          }
          throw new Error("Fallo al crear la planta en la database");
      }
    }

    async getById(id: number): Promise<Plant> {
        const connection = await this.getConnection();
        
        try {
          const [rows]: any = await connection.execute(
            `SELECT * FROM plants WHERE id = ?`,
            [id]
          );
    
          if (rows.length === 0) {
            throw new NotFoundError(`Planta con ID ${id} no encontrada`);
          }
          
          const plantData = rows[0];
          return new Plant(
            new NameValue(plantData.name),
            new DescriptionValue(plantData.description),
            new ImageUrlValue(plantData.imageUrl),
            new WateringFrequencyValue(plantData.wateringFrequency),
            new SunlightRequirementValue(plantData.sunlightRequirement),
            new FertilizationFrequencyValue(plantData.fertilizationFrequency),
            new TemperatureRangeValue(plantData.temperatureRange),
            new HumidityRequirementValue(plantData.humidityRequirement),
            new SoilTypeValue(plantData.soilType),
            new ToxicityLevel(plantData.toxicityLevel),
            new PriceValue(plantData.price),
            new HeightValue(plantData.height),
            plantData.id
          );
        } catch (error) {
          console.error("Error fetching plant from MySQL:", error);
          // Relanza el error si ya es un NotFoundError
          if (error instanceof NotFoundError) throw error;
          throw new Error("Failed to fetch plant from database");
        }
      }
    
      async getAll(): Promise<Plant[]> {
        const connection = await this.getConnection();
        
        try {
          const [rows]: any = await connection.execute(
            `SELECT * FROM plants`
          );
    
          return rows.map((plantsData: any) => 
            new Plant(
                new NameValue(plantsData.name),
                new DescriptionValue(plantsData.description),
                new ImageUrlValue(plantsData.imageUrl),
                new WateringFrequencyValue(plantsData.wateringFrequency),
                new SunlightRequirementValue(plantsData.sunlightRequirement),
                new FertilizationFrequencyValue(plantsData.fertilizationFrequency),
                new TemperatureRangeValue(plantsData.temperatureRange),
                new HumidityRequirementValue(plantsData.humidityRequirement),
                new SoilTypeValue(plantsData.soilType),
                new ToxicityLevel(plantsData.toxicityLevel),
                new PriceValue(plantsData.price),
                new HeightValue(plantsData.height),
                plantsData.id
            )
          );
        } catch (error) {
          console.error("Error fetching plants from MySQL:", error);
          throw new Error("Failed to fetch plants from database");
        }
      }
    
      async delete(id: number): Promise<void> {
        const connection = await this.getConnection();
        
        try {
          await connection.execute(
            `DELETE FROM plants WHERE id = ?`,
            [id]
          );
        } catch (error) {
          console.error("Error deleting plant from MySQL:", error);
          throw new Error("Failed to delete plant from database");
        }
      }
    
  async update(plant: Plant): Promise<void> {
    if (!plant.id) throw new Error("Planta id es requerido para actualizar");

    const connection = await this.getConnection();

    try {
        // Mapeo de propiedades a columnas
        const fieldsMap: Record<string, any> = {
            name: plant.name?.value,
            description: plant.description?.value,
            imageUrl: plant.imageUrl?.value,
            wateringFrequency: plant.wateringFrequency?.value,
            sunlightRequirement: plant.sunlightRequirement?.value,
            fertilizationFrequency: plant.fertilizationFrequency?.value,
            temperatureRange: plant.temperatureRange?.value,
            humidityRequirement: plant.humidityRequirement?.value,
            soilType: plant.soilType?.value,
            toxicityLevel: plant.toxicityLevel?.value,
            price: plant.price?.value,
            height: plant.height?.value,
        };

        const updateFields: string[] = [];
        const values: any[] = [];

        for (const [column, value] of Object.entries(fieldsMap)) {
            if (value !== undefined && value !== null) {
                updateFields.push(`${column} = ?`);
                values.push(value);
            }
        }

        if (updateFields.length === 0) {
            throw new Error("No hay campos válidos para actualizar");
        }

        values.push(plant.id); // Agrega ID al final
        const query = `UPDATE plants SET ${updateFields.join(', ')} WHERE id = ?`;

        console.log('Executing update query:', query);
        console.log('With values:', values);

        await connection.execute(query, values);
    } catch (error) {
        console.error("Error updating plant in MySQL:", error);
        throw new Error("Failed to update plant in database");
    }
  }

  async search(query: string): Promise<Plant[]> {
    const connection = await this.getConnection();

    // Usamos LIKE para coincidencias parciales
    const sql = `
      SELECT * FROM plants
      WHERE
        name LIKE ? OR
        description LIKE ? OR
        imageUrl LIKE ? OR
        sunlightRequirement LIKE ? OR
        temperatureRange LIKE ? OR
        humidityRequirement LIKE ? OR
        soilType LIKE ? OR
        toxicityLevel LIKE ? OR
        CAST(wateringFrequency AS CHAR) LIKE ? OR
        CAST(fertilizationFrequency AS CHAR) LIKE ? OR
        CAST(price AS CHAR) LIKE ? OR
        CAST(height AS CHAR) LIKE ?
    `;

    const likeQuery = `%${query}%`;
    const [rows] = await connection.execute(sql, Array(12).fill(likeQuery));

    return (rows as any[]).map(row =>
      new Plant(
        new NameValue(row.name),
        new DescriptionValue(row.description),
        new ImageUrlValue(row.imageUrl),
        new WateringFrequencyValue(row.wateringFrequency),
        new SunlightRequirementValue(row.sunlightRequirement),
        new FertilizationFrequencyValue(row.fertilizationFrequency),
        new TemperatureRangeValue(row.temperatureRange),
        new HumidityRequirementValue(row.humidityRequirement),
        new SoilTypeValue(row.soilType),
        new ToxicityLevel(row.toxicityLevel),
        new PriceValue(row.price),
        new HeightValue(row.height),
        row.id
      )
    );
  }

}
