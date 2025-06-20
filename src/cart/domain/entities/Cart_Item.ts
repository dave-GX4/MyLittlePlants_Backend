export class CartItem {
  constructor(
    public readonly plantId: number,
    public quantity: number,
    public priceSnapshot: number
  ) {}
}
