import { CartRepository } from "../domain/Cart_Repository";
import { CartItem } from "../domain/entities/Cart_Item";

export class AddToCartUseCase {
  constructor(private readonly repository: CartRepository) {}

  async run(userId: number, plantId: number, quantity: number, priceSnapshot: number): Promise<void> {
    const item = new CartItem(plantId, quantity, priceSnapshot);
    await this.repository.addItemToCart(userId, item);
  }
}
