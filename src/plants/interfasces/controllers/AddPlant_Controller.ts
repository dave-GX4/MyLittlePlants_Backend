import { Request, Response } from 'express';
import { AddPlantUseCase } from '../../../plants/application/AddPlant_UseCase';

export class AddPlantController {
  constructor(private addPlantUseCase: AddPlantUseCase) {}

  async run(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;

      // Verificación de seguridad: ¿hay un usuario autenticado? ¿Tiene el rol de vendedor?
      if (!user || !user.id || user.role !== 'Vendedor') {
        console.log('❌ Acceso no autorizado o rol incorrecto.');
        res.status(403).json({ error: 'Acceso denegado. Se requiere rol de vendedor.' });
        return;
      }

      const sellerId = user.id;

      if (!req.file) {
        console.log('❌ No se recibió ninguna imagen.');
        res.status(400).json({ error: 'La imagen de la planta es un campo requerido.' });
        return;
      }

      const imageUrl = req.file.path;

      console.log('📝 Received request body:', req.body);
      console.log('🖼️ Received file info:', req.file);

      const { 
        name, 
        description, 
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

      if (!name || !description || !wateringFrequency ||
          !sunlightRequirement || !fertilizationFrequency ||
          !temperatureRange || !humidityRequirement || !soilType || !toxicityLevel ||
          price === undefined  || height === undefined) {
        console.log('Campos requeridos faltan');
        res.status(400).json({ error: 'Faltan campos de texto requeridos en el cuerpo de la petición.' });
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
        Number(price),
        Number(height),
        sellerId
      )
      console.log('Planta creado con éxito');
      
      res.status(201).json({ message: 'exitoso' });
    } catch (error) {
      console.error('Error en el controlador:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}