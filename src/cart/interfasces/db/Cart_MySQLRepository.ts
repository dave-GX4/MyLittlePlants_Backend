import { CartRepository } from '../../domain/Cart_Repository';
import { Cart } from '../../domain/entities/Cart';
import { CartItem } from '../../domain/entities/Cart_Item';
import { MySQLClient } from '../../../core/db_MySQL';

export class CartMySQLRepository implements CartRepository {
  async getCartByUser(userId: number): Promise<Cart | null> {
    const connection = await MySQLClient.getInstance();

    const [cartRows]: any[] = await connection.execute(
      'SELECT id FROM carts WHERE user_id = ? LIMIT 1',
      [userId]
    );

    if (cartRows.length === 0) return null;

    const cartId = cartRows[0].id;

    const [itemRows]: any[] = await connection.execute(
      'SELECT plant_id, quantity, price_snapshot FROM cart_items WHERE cart_id = ?',
      [cartId]
    );

    const items = itemRows.map(
      (row: any) => new CartItem(row.plant_id, row.quantity, row.price_snapshot)
    );

    return new Cart(cartId, userId, items);
  }

  async addItemToCart(userId: number, item: CartItem): Promise<void> {
    const connection = await MySQLClient.getInstance();
    try {
      await connection.beginTransaction();

      const [cartRows]: any[] = await connection.execute(
        'SELECT id FROM carts WHERE user_id = ?',
        [userId]
      );

      let cartId: number;
      if (cartRows.length === 0) {
        const [result]: any = await connection.execute(
          'INSERT INTO carts (user_id) VALUES (?)',
          [userId]
        );
        cartId = result.insertId;
      } else {
        cartId = cartRows[0].id;
      }

      const [existing]: any[] = await connection.execute(
        'SELECT quantity FROM cart_items WHERE cart_id = ? AND plant_id = ?',
        [cartId, item.plantId]
      );

      if (existing.length > 0) {
        await connection.execute(
          'UPDATE cart_items SET quantity = quantity + ? WHERE cart_id = ? AND plant_id = ?',
          [item.quantity, cartId, item.plantId]
        );
      } else {
        await connection.execute(
          'INSERT INTO cart_items (cart_id, plant_id, quantity, price_snapshot) VALUES (?, ?, ?, ?)',
          [cartId, item.plantId, item.quantity, item.priceSnapshot]
        );
      }

      await connection.commit();
    } catch (err) {
      await connection.rollback();
      throw err;
    }
  }

  async removeItemFromCart(userId: number, plantId: number): Promise<void> {
    const connection = await MySQLClient.getInstance();
    const [cartRows]: any[] = await connection.execute(
      'SELECT id FROM carts WHERE user_id = ?',
      [userId]
    );
    if (cartRows.length === 0) return;
    const cartId = cartRows[0].id;

    await connection.execute(
      'DELETE FROM cart_items WHERE cart_id = ? AND plant_id = ?',
      [cartId, plantId]
    );
  }

  async clearCart(userId: number): Promise<void> {
    const connection = await MySQLClient.getInstance();
    const [cartRows]: any[] = await connection.execute(
      'SELECT id FROM carts WHERE user_id = ?',
      [userId]
    );
    if (cartRows.length === 0) return;
    const cartId = cartRows[0].id;

    await connection.execute('DELETE FROM cart_items WHERE cart_id = ?', [cartId]);
  }
}