import { Request, Response } from 'express';
import { CreateUserUseCase } from '../../application/usecases/CreateUser_UseCase';

export class CreateUserController {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  async run(req: Request, res: Response): Promise<void> {
    try {
      console.log('📝 Received request body:', req.body);
      const { name, email, phone, password } = req.body;

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

      await this.createUserUseCase.run(name, email, phone, password);
      console.log('✅ User created successfully');
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      console.error('❌ Error in CreateUserController:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}