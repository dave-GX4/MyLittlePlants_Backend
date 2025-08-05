import pool from "../../../core/db_MySQL"; 
import { User } from "../../domain/entities/User";
import { EmailValue } from "../../domain/entities/objectValues/Email_Value";
import { NameValue } from "../../domain/entities/objectValues/Name_Value";
import { PasswordValue } from "../../domain/entities/objectValues/Password_Value";
import { PhoneValue } from "../../domain/entities/objectValues/Phone_Value";
import { UserRepository } from "../../domain/User_Repository";
import { RoleValue } from "../../domain/entities/objectValues/Role_Value";
import { NotFoundError } from "../../domain/entities/objectValues/NotFoundError";

export class UserMySQLRepository implements UserRepository {

  // PASO 2: Eliminar el método `getConnection`. Ya no es necesario.
  
  async create(user: User): Promise<void> {
    let connection;
    try {
      connection = await pool.getConnection();
      await connection.execute(
          `INSERT INTO users (name, email, password, role, wantsToBeSeller, phone) 
          VALUES (?, ?, ?, ?, ?, ?)`,
          [
              user.name.value,
              user.email.value,
              user.password.value,
              user.role.value,
              user.wantsToBeSeller,
              user.phone?.value ?? null,
          ]
      );
    } catch (error) {
      console.error("Error creating user in MySQL:", error);
      throw new Error("Failed to create user in database");
    } finally {
      // PASO 3: Liberar la conexión para devolverla al pool
      if (connection) {
        connection.release();
      }
    }
  }

  async finedByEmail(email: string): Promise<User | null> {
    let connection;
    try {
      connection = await pool.getConnection();
      const [rows]: any = await connection.execute(
        `SELECT * FROM users WHERE email = ?`,
        [email]
      );

      if (rows.length === 0) {
        return null;
      }

      const userData = rows[0];
      return new User(
        new NameValue(userData.name),
        new EmailValue(userData.email),
        PasswordValue.fromHashed(userData.password),
        new RoleValue(userData.role),
        userData.wantsToBeSeller,
        userData.phone ? new PhoneValue(userData.phone) : undefined,
        userData.id
      );
    } catch (error) {
      console.error("Error fetching user by email from MySQL:", error);
      throw new Error("Failed to fetch user by email from database");
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  async getById(id: number): Promise<User | null> {
    let connection;
    try {
      connection = await pool.getConnection();
      const [rows]: any = await connection.execute(
        `SELECT * FROM users WHERE id = ?`,
        [id]
      );

      if (rows.length === 0) {
        return null;
      }
      
      const userData = rows[0];
      return new User(
        new NameValue(userData.name),
        new EmailValue(userData.email),
        PasswordValue.fromHashed(userData.password),
        new RoleValue(userData.role),
        userData.wantsToBeSeller,
        userData.phone ? new PhoneValue(userData.phone) : undefined,
        userData.id
      );
    } catch (error) {
      console.error("Error fetching user from MySQL:", error);
      throw new Error("Failed to fetch user from database");
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  async getAll(): Promise<User[]> {
    let connection;
    try {
      connection = await pool.getConnection();
      const [rows]: any = await connection.execute(
        `SELECT * FROM users`
      );

      return rows.map((userData: any) => {
        return new User(
            new NameValue(userData.name),
            new EmailValue(userData.email),
            PasswordValue.fromHashed(userData.password),
            new RoleValue(userData.role),
            userData.wantsToBeSeller,
            userData.phone ? new PhoneValue(userData.phone) : undefined,
            userData.id
        );
      });
    } catch (error) {
      console.error("Error fetching users from MySQL:", error);
      throw new Error("Failed to fetch users from database");
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  async getSellerRequests(): Promise<User[]> {
    let connection;
    try {
        connection = await pool.getConnection();
        const sql = "SELECT * FROM users WHERE wantsToBeSeller = TRUE AND role = 'Usuario'";
        const [rows]: any = await connection.execute(sql);

        return rows.map((userData: any) => {
            return new User(
                new NameValue(userData.name),
                new EmailValue(userData.email),
                PasswordValue.fromHashed(userData.password),
                new RoleValue(userData.role),
                userData.wantsToBeSeller,
                userData.phone ? new PhoneValue(userData.phone) : undefined,
                userData.id
            );
        });
    } catch (error) {
        console.error("Error fetching seller requests from MySQL:", error);
        throw new Error("Failed to fetch seller requests from database");
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  async delete(id: number): Promise<void> {
    let connection;
    try {
      connection = await pool.getConnection();
      await connection.execute(
        `DELETE FROM users WHERE id = ?`,
        [id]
      );
    } catch (error) {
      console.error("Error deleting user from MySQL:", error);
      throw new Error("Failed to delete user from database");
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  async update(id: number, user: User): Promise<void> {
    let connection;
    try {
      connection = await pool.getConnection();
      const query = `
        UPDATE users SET 
          name = ?,
          email = ?,
          password = ?,
          phone = ?
        WHERE id = ?
      `;
      
      const values = [
        user.name.value,
        user.email.value,
        user.password.value,
        user.phone?.value ?? null,
        id
      ];

      await connection.execute(query, values);
    } catch (error) {
      console.error("Error updating user in MySQL:", error);
      throw new Error("Failed to update user in database");
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  async updateRole(id: number, role: RoleValue): Promise<void> {
    let connection;
    try {
        connection = await pool.getConnection();
        const sql = "UPDATE users SET role = ? WHERE id = ?";
        const params = [role.value, id];
        const [result]: any = await connection.execute(sql, params);

        if (result.affectedRows === 0) {
            throw new NotFoundError(`User with ID ${id} not found.`); 
        }
    } catch (error) {
        console.error(`Error updating role for user ID: ${id} in MySQL:`, error);
        if (error instanceof NotFoundError) throw error;
        throw new Error("Failed to update user role in database");
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  async updateSellerRequestStatus(id: number, status: boolean): Promise<void> {
    let connection;
    try {
        connection = await pool.getConnection();
        const sql = "UPDATE users SET wantsToBeSeller = ? WHERE id = ?";
        const params = [status, id];
        await connection.execute(sql, params);
    } catch (error) {
        console.error(`Error updating seller request status for user ID: ${id}`, error);
        throw new Error("Failed to update seller request status in database");
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }
}