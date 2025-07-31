import { Request, Response } from 'express';
import { NotFoundError } from "../../dominio/entities/valueObject/NotFoundError";
import { GetByIdUseCase } from '../../application/GetById_UseCase';

export class GetByIdController {
    constructor(private readonly getByIdUseCase: GetByIdUseCase) {}

    async run(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            
            if (isNaN(id)) {
                res.status(400).json({
                success: false,
                error: 'Invalid ID format'
                });
                return;
            }

            // Ejecutar el caso de uso
            const plant = await this.getByIdUseCase.run(id);

            // Convertir a DTO para la respuesta
            const plantResponse = {
                id: plant.id,
                name: plant.name.value,
                description: plant.description.value,
                wateringFrequency: plant.wateringFrequency.value,
                sunlinghtRequirement: plant.sunlightRequirement.value,
                fertilizationFrequency: plant.fertilizationFrequency.value,
                temperatureRange: plant.temperatureRange.value,
                humidityRequirement: plant.humidityRequirement.value,
                soilType: plant.soilType.value,
                toxicityLevel: plant.toxicityLevel.value,
                price: plant.price.value,
                height: plant.height.value,
            };

            res.status(200).json({
                success: true,
                data: plantResponse
            });

        } catch (error) {
            if (error instanceof NotFoundError) {
                res.status(404).json({
                success: false,
                error: error.message
                });
            } else {
                console.error('Error en GetByIdController:', error);
                res.status(500).json({
                success: false,
                error: 'Internal server error while fetching plant'
                });
            }
        }
    }
}