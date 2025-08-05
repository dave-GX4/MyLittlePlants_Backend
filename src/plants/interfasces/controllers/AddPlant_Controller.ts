import { Request, Response } from 'express';
import { AddPlantUseCase } from '../../../plants/application/AddPlant_UseCase';

export class AddPlantController {
  constructor(private addPlantUseCase: AddPlantUseCase) {}

  async run(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;

      if (!user || !user.id || user.role !== 'Vendedor') {
        res.status(403).json({ error: 'Acceso denegado. Se requiere rol de vendedor.' });
        return;
      }

      if (!req.file) {
        res.status(400).json({ error: 'La imagen de la planta es un campo requerido.' });
        return;
      }

      // --- INICIO DE LA LÓGICA CORREGIDA ---

      // 1. Obtenemos el nombre del archivo guardado por Multer.
      const filename = req.file.filename;

      // 2. Construimos la URL base del servidor de forma dinámica.
      //    Ej: http://98.83.75.45:3000
      const baseUrl = `${req.protocol}://${req.get('host')}`;

      // 3. Creamos la URL pública completa para la imagen.
      //    Ej: http://98.83.75.45:3000/uploads/plantImage-1754...jpg
      const fullImageUrl = `${baseUrl}/uploads/${filename}`;

      // --- FIN DE LA LÓGICA CORREGIDA ---

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

      // Validación de campos de texto (esto está bien como está)
      if (!name || !description || !wateringFrequency ||
          !sunlightRequirement || !fertilizationFrequency ||
          !temperatureRange || !humidityRequirement || !soilType || !toxicityLevel ||
          price === undefined  || height === undefined) {
        res.status(400).json({ error: 'Faltan campos de texto requeridos en el cuerpo de la petición.' });
        return;
      }
      
      // 4. Pasamos la URL completa (fullImageUrl) al caso de uso.
      await this.addPlantUseCase.run(
        name,
        description,
        fullImageUrl, // <--- Aquí usamos la URL completa que construimos
        wateringFrequency,
        sunlightRequirement,
        fertilizationFrequency,
        temperatureRange,
        humidityRequirement,
        soilType,
        toxicityLevel,
        Number(price),
        Number(height),
        user.id // Usamos el sellerId del usuario autenticado
      );
      
      res.status(201).json({ message: 'Planta creada con éxito' });

    } catch (error) {
      console.error('Error en el controlador al añadir planta:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}