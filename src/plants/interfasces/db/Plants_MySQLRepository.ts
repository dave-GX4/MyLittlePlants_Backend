import { MySQLClient } from "../../../core/db_MySQL";
import { Plant } from "../../dominio/entities/Plant";
import { PlantRepository } from "../../dominio/Plant_Repository";
import { DescriptionValue } from "../../dominio/entities/valueObject/Description_Value";
import { FertilizationFrequencyValue } from "../../dominio/entities/valueObject/Fertilization_Value";
import { HeightValue } from "../../dominio/entities/valueObject/Height_Value";
import { HumidityRequirementValue } from "../../dominio/entities/valueObject/Humidity_Value";
import { ImageUrlValue } from "../../dominio/entities/valueObject/ImageUrl_Value";
import { NameValue } from "../../dominio/entities/valueObject/Name_Value";
import { NotFoundError } from "../../dominio/entities/valueObject/NotFoundError";
import { PriceValue } from "../../dominio/entities/valueObject/Price_Value";
import { SoilTypeValue } from "../../dominio/entities/valueObject/Soil_Value";
import { SunlightRequirementValue } from "../../dominio/entities/valueObject/Sunlight_Value";
import { TemperatureRangeValue } from "../../dominio/entities/valueObject/Temperature_Value";
import { ToxicityLevel } from "../../dominio/entities/valueObject/Toxocity_Value";
import { WateringFrequencyValue } from "../../dominio/entities/valueObject/Watering_Value";

export class PlantMySQLRepository implements PlantRepository {
  private async getConnection() {
    return await MySQLClient.getInstance();
  }

  async addPlant(plant: Plant): Promise<void> {
    const connection = await this.getConnection();
    try {
      await connection.execute(
        `INSERT INTO plants (
          name, description, imageUrl, wateringFrequency, sunlightRequirement, 
          fertilizationFrequency, temperatureRange, humidityRequirement, soilType, 
          toxicityLevel, price, height, sellerId
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
          plant.sellerId 
        ]
      );
      console.log(`La planta se creó correctamente para el vendedor ${plant.sellerId}`);
    } catch (error) {
      console.error("Error al crear la planta en MySQL:", error);
      if (error instanceof Error) {
        throw new Error(`Database error: ${error.message}`);
      }
      throw new Error("Fallo al crear la planta en la base de datos");
    } finally {
      if (connection) {
        connection.end();
      }
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
    if (!plant.id || !plant.sellerId) {
      throw new Error("Tanto el ID de la planta como el ID del vendedor son requeridos para actualizar");
    }

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

      values.push(plant.id);
      values.push(plant.sellerId);

      const query = `UPDATE plants SET ${updateFields.join(', ')} WHERE id = ? AND sellerId = ?`;

      const [result] = await connection.execute(query, values);

      if ((result as any).affectedRows === 0) {
        throw new Error("La planta no fue encontrada o no tienes permiso para actualizarla.");
      }

      await connection.execute(query, values);
    } catch (error) {
        console.error("Error al actualizar la planta en la db:", error);
        throw new Error("Fallo al actualizar la planta en la base de datos");
    } finally {
        if (connection) connection.end();
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

  async findBySellerId(sellerId: number): Promise<Plant[]> {
    const connection = await this.getConnection();
    try {
      const sql = "SELECT * FROM plants WHERE sellerId = ?";

      const [rows] = await connection.execute(sql, [sellerId]);

      if (!Array.isArray(rows) || rows.length === 0) {
        console.log(`No se encontraron plantas para el vendedor con ID: ${sellerId}`);
        return [];
      }

      const plants = (rows as any[]).map(row => {
        return new Plant(
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
          row.sellerId,
          row.id
        );
      });
      console.log(`Se encontraron ${plants.length} plantas para el vendedor con ID: ${sellerId}`);
      return plants;
    } catch (error) {
      console.error(`Error al buscar plantas por sellerId (${sellerId}) en MySQL:`, error);
      if (error instanceof Error) {
        throw new Error(`Database error: ${error.message}`);
      }
      throw new Error("Fallo al buscar las plantas del vendedor en la base de datos");
    } finally {
      if (connection) {
          connection.end();
      }
    }
  }
}
