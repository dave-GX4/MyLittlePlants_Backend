import { CartItem } from "./Cart_Item";

export class Cart {
  constructor(
    public readonly id: number,
    public readonly userId: number,
    public items: CartItem[] = []
  ) {}
}
