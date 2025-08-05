// PASO 1: Importar el 'pool' desde tu archivo de base de datos
import pool from '../../../core/db_MySQL';
import { CartRepository } from '../../domain/Cart_Repository';
import { Cart } from '../../domain/entities/Cart';
import { CartItem } from '../../domain/entities/Cart_Item';

export class CartMySQLRepository implements CartRepository {

  // PASO 2: Eliminar cualquier referencia a MySQLClient o al método getConnection

  async getCartByUser(userId: number): Promise<Cart | null> {
    let connection;
    try {
      // Pide una conexión del pool
      connection = await pool.getConnection();

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

    } catch (error) {
      console.error("Error fetching cart from MySQL:", error);
      throw new Error("Failed to fetch cart from database");
    } finally {
      // PASO 3: Liberar siempre la conexión al finalizar
      if (connection) {
        connection.release();
      }
    }
  }

  async addItemToCart(userId: number, item: CartItem): Promise<void> {
    let connection;
    try {
      connection = await pool.getConnection();
      // Inicia la transacción en la conexión obtenida del pool
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
      
      // Si todo fue bien, confirma la transacción
      await connection.commit();

    } catch (err) {
      // Si algo falla, revierte la transacción
      if (connection) {
        await connection.rollback();
      }
      console.error("Error adding item to cart (transaction rolled back):", err);
      throw new Error("Failed to add item to cart");
    } finally {
      // Libera la conexión, tanto si la transacción tuvo éxito como si falló
      if (connection) {
        connection.release();
      }
    }
  }

  async removeItemFromCart(userId: number, plantId: number): Promise<void> {
    let connection;
    try {
      connection = await pool.getConnection();
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
    } catch (error) {
      console.error("Error removing item from cart:", error);
      throw new Error("Failed to remove item from cart");
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  async clearCart(userId: number): Promise<void> {
    let connection;
    try {
      connection = await pool.getConnection();
      const [cartRows]: any[] = await connection.execute(
        'SELECT id FROM carts WHERE user_id = ?',
        [userId]
      );
      if (cartRows.length === 0) return;
      const cartId = cartRows[0].id;

      await connection.execute('DELETE FROM cart_items WHERE cart_id = ?', [cartId]);
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw new Error("Failed to clear cart");
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }
}