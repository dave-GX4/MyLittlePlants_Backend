import { Request, Response } from 'express';
import { CreateUserUseCase } from '../../application/usecases/CreateUser_UseCase';

export class CreateUserController {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  async run(req: Request, res: Response): Promise<void> {
    try {
      console.log('📝 Received request body:', req.body);
      
      const { name, email, phone, password, wantsToBeSeller  } = req.body;

      // El campo 'wantsToBeSeller' puede ser opcional (si no se envía, es false)
      const sellerRequest = wantsToBeSeller === true;

      if (!name || !email || !password) {
        console.log('❌ Missing required fields');
        res.status(400).json({ 
          error: 'Missing required fields',
          missing: {
            name: !name,
            email: !email,
            password: !password
          },
          success: false
        });
        return;
      }

      await this.createUserUseCase.run(name, email, phone, password, sellerRequest);

      console.log('✅ User created successfully');
      res.status(201).json({ message: 'User created successfully' });

    } catch (error) {
      console.error('❌ Error in CreateUserController:', error);
      
      // Capturará tanto errores del servidor
      // como errores de validación de negocio (ej. rol inválido) del 'UseCase'.
      res.status(error instanceof Error && error.message.includes("rol válido") ? 400 : 500)
         .json({ 
            error: 'Internal server error',
            message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}