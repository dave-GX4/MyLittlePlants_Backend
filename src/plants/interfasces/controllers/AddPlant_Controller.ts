import { Request, Response } from 'express';
import { AddPlantUseCase } from '../../../plants/application/AddPlant_UseCase';

export class AddPlantController {
  constructor(private addPlantUseCase: AddPlantUseCase) {}

  async run(req: Request, res: Response): Promise<void> {
    try {
      console.log('📝 Received request body:', req.body);
      const { 
        name, 
        description, 
        imageUrl, 
        wateringFrequency, 
        sunlightRequirement,
        fertilizationFrequency,  
        temperatureRange,
        humidityRequirement,
        soilType,
        toxicityLevel,
        price,
        height,
      } = req.body;

      if (!name || !description || !imageUrl || !wateringFrequency ||
          !sunlightRequirement || !fertilizationFrequency ||
          !temperatureRange || !humidityRequirement || !soilType || !toxicityLevel ||
          !price || !height) {
        console.log('❌ los campos requeridos faltan');
        res.status(400).json({ 
          error: 'Campos requeridos faltan',
          missing: {
            name: !name,
            description: !description,
            imageUrl: !imageUrl,
            wateringFrequency: !wateringFrequency,
          }
        });
        return;
      }

      await this.addPlantUseCase.run(
        name,
        description,
        imageUrl,
        wateringFrequency,
        sunlightRequirement,
        fertilizationFrequency,
        temperatureRange,
        humidityRequirement,
        soilType,
        toxicityLevel,
        price,
        height,
      )
      console.log('✅ Planta creado con éxito');
      res.status(201).json({ message: 'exitoso' });
    } catch (error) {
      console.error('❌ Error en el controlador:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}