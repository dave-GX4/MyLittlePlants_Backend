import { CartRepository } from '../domain/Cart_Repository';
import { Cart } from '../domain/entities/Cart';

export class GetCartByUserUseCase {
  constructor(private readonly repository: CartRepository) {}

  async run(userId: number): Promise<Cart | null> {
    return await this.repository.getCartByUser(userId);
  }
}
