import { Router } from 'express';
import { isAuthenticated, hasRole } from '../../core/middlewares/authMiddleware';
import {
  createUserController,
  getByIdController,
  getAllController,
  updateUserController,
  deleteUserController,
  finedByEmailController,
  updateRoleController,
  getSellerRequestsController,
  loginController
} from './Dependencies';

const userRouter = Router();

// Configurar rutas publicas
userRouter.post('/login', (req, res) => loginController.run(req, res));
userRouter.post('/create-user', (req, res) => createUserController.run(req, res));
userRouter.get('/user/:email', (req, res) => finedByEmailController.run(req, res));

//Ruta protegida de actualizacion de rol solo administrador
userRouter.put(
  '/admin/:id/role',
  isAuthenticated,
  hasRole(['Administrador']),
  (req, res) => updateRoleController.run(req, res)
);
userRouter.get(
  '/requests/sellers',
  isAuthenticated,
  hasRole(['Administrador']),
  (req, res) => getSellerRequestsController.run(req, res)
);

// Rutas protegidas [vendedor y usuario]
userRouter.put(
  '/update/:id',
  isAuthenticated,
  (req, res) => updateUserController.run(req, res)
);
userRouter.delete(
  '/users/:id',
  isAuthenticated,
  (req, res) => deleteUserController.run(req, res)
);
userRouter.get(
  '/users',
  isAuthenticated,
  (req, res) => getAllController.run(req, res)
);
userRouter.get(
  '/user/:id',
  isAuthenticated,
  (req, res) => getByIdController.run(req, res)
);

export default userRouter;