import { CartMySQLRepository } from "./db/Cart_MySQLRepository";

import { AddToCartUseCase } from "../application/AddToCart_UseCase";
import { ClearCartUseCase } from "../application/ClearCartUseCase";
import { GetCartByUserUseCase } from "../application/GetCartByUser_UseCase";
import { RemoveFromCartUseCase } from "../application/RemoveItemFromCart_UseCase";

import { AddToCartController } from "./controllers/AddToCart_Controller";
import { ClearCartController } from "./controllers/ClearCart_Controller";
import { GetCartByUserController } from "./controllers/GetCartByUser_Controller";
import { RemoveItemFromCartController } from "./controllers/RemoveItemFromCart_Controller";

const cartRepository = new CartMySQLRepository();

const addToCartUseCase = new AddToCartUseCase(cartRepository);
const clearCartUseCase = new ClearCartUseCase(cartRepository);
const getCartByUserUseCase = new GetCartByUserUseCase(cartRepository);
const removeItemFromCartUseCase = new RemoveFromCartUseCase(cartRepository); 

export const addToCartController = new AddToCartController(addToCartUseCase);
export const clearCartController = new ClearCartController(clearCartUseCase);
export const getCartByUserController = new GetCartByUserController(getCartByUserUseCase);
export const removeItemFromCartController = new RemoveItemFromCartController(removeItemFromCartUseCase);