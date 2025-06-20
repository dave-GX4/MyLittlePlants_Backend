import { CartRepository } from '../domain/Cart_Repository';

export class RemoveFromCartUseCase {
  constructor(private readonly repository: CartRepository) {}

  async run(userId: number, plantId: number): Promise<void> {
    await this.repository.removeItemFromCart(userId, plantId);
  }
}
