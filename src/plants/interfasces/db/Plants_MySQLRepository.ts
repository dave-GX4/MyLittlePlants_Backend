// PASO 1: Importar el 'pool' por defecto desde tu archivo de base de datos
import pool from "../../../core/db_MySQL"; 

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

  // PASO 2: Eliminar el método `getConnection`. Ya no es necesario.
  
  async addPlant(plant: Plant): Promise<void> {
    let connection;
    try {
      // Pide una conexión del pool
      connection = await pool.getConnection(); 
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
    } catch (error) {
      console.error("Error al crear la planta en MySQL:", error);
      if (error instanceof Error) {
        throw new Error(`Database error: ${error.message}`);
      }
      throw new Error("Fallo al crear la planta en la base de datos");
    } finally {
      // PASO 3: Liberar la conexión para devolverla al pool
      if (connection) {
        connection.release();
      }
    }
  }

  async getById(id: number): Promise<Plant> {
    let connection;
    try {
      connection = await pool.getConnection();
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
        plantData.sellerId,
        plantData.id
      );
    } catch (error) {
      console.error("Error fetching plant from MySQL:", error);
      if (error instanceof NotFoundError) throw error;
      throw new Error("Failed to fetch plant from database");
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }
    
  async getAll(): Promise<Plant[]> {
    let connection;
    try {
      connection = await pool.getConnection();
      const [rows]: any = await connection.execute(
        `SELECT * FROM plants`
      );

      return rows.map((plantData: any) => 
        new Plant(
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
          plantData.sellerId,
          plantData.id
        )
      );
    } catch (error) {
      console.error("Error fetching plants from MySQL:", error);
      throw new Error("Failed to fetch plants from database");
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }
    
  async delete(id: number): Promise<void> {
    let connection;
    try {
      connection = await pool.getConnection();
      await connection.execute(
        `DELETE FROM plants WHERE id = ?`,
        [id]
      );
    } catch (error) {
      console.error("Error deleting plant from MySQL:", error);
      throw new Error("Failed to delete plant from database");
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }
    
  async update(plant: Plant): Promise<void> {
    if (!plant.id || !plant.sellerId) {
      throw new Error("Tanto el ID de la planta como el ID del vendedor son requeridos para actualizar");
    }

    let connection;
    try {
      connection = await pool.getConnection();
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

    } catch (error) {
        console.error("Error al actualizar la planta en la db:", error);
        throw new Error("Fallo al actualizar la planta en la base de datos");
    } finally {
        if (connection) {
          connection.release();
        }
    }
  }

  async search(query: string): Promise<Plant[]> {
    let connection;
    try {
      connection = await pool.getConnection();
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
          row.sellerId,
          row.id
        )
      );
    } catch (error) {
      console.error("Error searching plants in MySQL:", error);
      throw new Error("Failed to search plants in database");
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  async findBySellerId(sellerId: number): Promise<Plant[]> {
    let connection;
    try {
      connection = await pool.getConnection();
      const sql = "SELECT * FROM plants WHERE sellerId = ?";
      const [rows] = await connection.execute(sql, [sellerId]);

      if (!Array.isArray(rows) || rows.length === 0) {
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
      return plants;
    } catch (error) {
      console.error(`Error al buscar plantas por sellerId (${sellerId}) en MySQL:`, error);
      if (error instanceof Error) {
        throw new Error(`Database error: ${error.message}`);
      }
      throw new Error("Fallo al buscar las plantas del vendedor en la base de datos");
    } finally {
      if (connection) {
          connection.release();
      }
    }
  }
}