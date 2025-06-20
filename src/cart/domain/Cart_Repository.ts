import { Cart } from "./entities/Cart";
import { CartItem } from "./entities/Cart_Item";

export interface CartRepository {
  getCartByUser(userId: number): Promise<Cart | null>;
  addItemToCart(userId: number, item: CartItem): Promise<void>;
  removeItemFromCart(userId: number, plantId: number): Promise<void>;
  clearCart(userId: number): Promise<void>;
}
