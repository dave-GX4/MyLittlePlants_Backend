import { Request, Response } from 'express';
import { GetAllUseCase } from '../../application/GetAll_UseCase';

export class GetAllController {
  constructor(private readonly getAllUseCase: GetAllUseCase) {}

  async run(req: Request, res: Response): Promise<void> {
    try {
      // Ejecutar el caso de uso
      const plants = await this.getAllUseCase.run();

      const usersResponse = plants.map(plant => ({
        name: plant.name.value,
        description: plant.description.value,
        imageUrl: plant.imageUrl.value,
        wateringFrequency: plant.fertilizationFrequency.value,
        sunlighRequirement: plant.sunlightRequirement.value,
        fertilizationFrequency: plant.fertilizationFrequency.value,
        temperatureRange: plant.temperatureRange.value,
        humidityRequirement: plant.humidityRequirement.value,
        soilType: plant.soilType.value,
        toxicityLevel: plant.toxicityLevel.value,
        price: plant.price.value,
        height: plant.height.value,
      }));

      res.status(200).json({
        success: true,
        data: usersResponse
      });
    } catch (error) {
      console.error('Error en GetAllController:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error while fetching plants'
      });
    }
  }
}