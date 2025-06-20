import { Router } from 'express';
import { addToCartController, clearCartController, getCartByUserController, removeItemFromCartController } from './Dependence';

const cartRouter = Router();

cartRouter.post('/cart', (req, res) => addToCartController.run(req, res));
cartRouter.get('/cart/:userId', (req, res) => getCartByUserController.run(req, res));
cartRouter.delete('/cart', (req, res) => removeItemFromCartController.run(req, res));
cartRouter.delete('/cart/clear/:userId', (req, res) => clearCartController.run(req, res));

export default cartRouter;
