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
      
      if (error instanceof Error) {
        // Si el error es por correo duplicado, devolvemos 409 Conflict.
        if (error.message === 'El correo electrónico ya está registrado.') {
          res.status(409).json({ message: error.message, success: false });
          return;
        }
        
        // Si el error es por un rol inválido, devolvemos 400 Bad Request.
        if (error.message.includes("rol válido")) {
          res.status(400).json({ message: error.message, success: false });
          return;
        }
      }
      
      // Para cualquier otro tipo de error, devolvemos 500 Internal Server Error.
      res.status(500).json({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
        success: false
      });
    }
  }
}