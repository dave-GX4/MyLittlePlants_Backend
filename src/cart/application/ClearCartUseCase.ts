import { CartRepository } from '../domain/Cart_Repository';

export class ClearCartUseCase {
  constructor(private readonly repository: CartRepository) {}

  async run(userId: number): Promise<void> {
    await this.repository.clearCart(userId);
  }
}
