import { Router } from 'express';
import {
  createUserController,
  getByIdController,
  getAllController,
  updateUserController,
  deleteUserController,
  finedByEmailController,
} from './Dependencies';

const userRouter = Router();

// Configurar rutas
userRouter.post('/users', (req, res) => createUserController.run(req, res));
userRouter.get('/users', (req, res) => getAllController.run(req, res));
userRouter.get('/users/:id', (req, res) => getByIdController.run(req, res));
userRouter.get('/users/:email',(req, res) => finedByEmailController.run(req, res))
userRouter.put('/users/:id', (req, res) => updateUserController.run(req, res));
userRouter.delete('/users/:id', (req, res) => deleteUserController.run(req, res));

export default userRouter;