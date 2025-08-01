import { Router } from 'express';
import {
  createUserController,
  getByIdController,
  getAllController,
  updateUserController,
  deleteUserController,
  finedByEmailController,
  updateRoleController,
  getSellerRequestsController
} from './Dependencies';

const userRouter = Router();

// Configurar rutas
userRouter.post('/create-user', (req, res) => createUserController.run(req, res));
userRouter.get('/requests/sellers', (req, res) => getSellerRequestsController.run(req, res));
userRouter.get('/users', (req, res) => getAllController.run(req, res));
userRouter.get('/user/:id', (req, res) => getByIdController.run(req, res));
userRouter.get('/user/:email', (req, res) => finedByEmailController.run(req, res));
userRouter.put('/update/:id', (req, res) => updateUserController.run(req, res));
userRouter.put('/admin/:id/role', (req, res) => updateRoleController.run(req, res));
userRouter.delete('/users/:id', (req, res) => deleteUserController.run(req, res));

export default userRouter;