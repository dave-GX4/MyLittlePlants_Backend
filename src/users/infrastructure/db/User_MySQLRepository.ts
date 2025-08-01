import { MySQLClient } from "../../../core/db_MySQL";
import { User } from "../../domain/entities/User";
import { EmailValue } from "../../domain/entities/objectValues/Email_Value";
import { NameValue } from "../../domain/entities/objectValues/Name_Value";
import { PasswordValue } from "../../domain/entities/objectValues/Password_Value";
import { PhoneValue } from "../../domain/entities/objectValues/Phone_Value";
import { UserRepository } from "../../domain/User_Repository";
import { RoleValue } from "../../domain/entities/objectValues/Role_Value";

export class UserMySQLRepository implements UserRepository {
  private async getConnection() {
    return await MySQLClient.getInstance();
  }

  // CREATE
  async create(user: User): Promise<void> {
    const connection = await this.getConnection();
    try {
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
    }
  }

  // FIND BY EMAIL
  async finedByEmail(email: string): Promise<User | null> {
    const connection = await this.getConnection();
    try {
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
        userData.wantsToBeSeller, // <-- CAMBIO: Añadido el argumento que faltaba
        userData.phone ? new PhoneValue(userData.phone) : undefined,
        userData.id
      );
    } catch (error) {
      console.error("Error fetching user by email from MySQL:", error);
      throw new Error("Failed to fetch user by email from database");
    }
  }

  // GET BY ID (Corregido)
  async getById(id: number): Promise<User | null> {
    const connection = await this.getConnection();
    try {
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
        userData.wantsToBeSeller, // <-- CAMBIO: Añadido el argumento que faltaba
        userData.phone ? new PhoneValue(userData.phone) : undefined,
        userData.id
      );
    } catch (error) {
      console.error("Error fetching user from MySQL:", error);
      throw new Error("Failed to fetch user from database");
    }
  }

  // GET ALL (Corregido)
  async getAll(): Promise<User[]> {
    const connection = await this.getConnection();
    try {
      const [rows]: any = await connection.execute(
        `SELECT * FROM users`
      );

      return rows.map((userData: any) => {
        return new User(
            new NameValue(userData.name),
            new EmailValue(userData.email),
            PasswordValue.fromHashed(userData.password),
            new RoleValue(userData.role),
            userData.wantsToBeSeller, // <-- CAMBIO: Añadido el argumento que faltaba
            userData.phone ? new PhoneValue(userData.phone) : undefined,
            userData.id
        );
      });
    } catch (error) {
      console.error("Error fetching users from MySQL:", error);
      throw new Error("Failed to fetch users from database");
    }
  }

  async getSellerRequests(): Promise<User[]> {
    const connection = await this.getConnection();

    try {
        // La consulta SQL filtra por dos condiciones:
        // 1. El usuario QUIERE ser vendedor (wantsToBeSeller = TRUE)
        // 2. El usuario TODAVÍA no ha sido aprobado (role = 'Usuario')
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
    }
  }

  // DELETE
  async delete(id: number): Promise<void> {
    const connection = await this.getConnection();
    try {
      await connection.execute(
        `DELETE FROM users WHERE id = ?`,
        [id]
      );
    } catch (error) {
      console.error("Error deleting user from MySQL:", error);
      throw new Error("Failed to delete user from database");
    }
  }

  // UPDATE
  async update(id: number, user: User): Promise<void> {
    const connection = await this.getConnection();
    try {
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
    }
  }

  // UPDATE ROLE
  async updateRole(id: number, role: RoleValue): Promise<void> {
    const connection = await this.getConnection();
    try {
        const sql = "UPDATE users SET role = ? WHERE id = ?";
        const params = [role.value, id];

        const [result]: any = await connection.execute(sql, params);

        if (result.affectedRows === 0) {
            // Este error será capturado por el caso de uso y convertido en un NotFoundError
            throw new Error(`User with ID ${id} not found.`); 
        }
    } catch (error) {
        console.error(`Error updating role for user ID: ${id} in MySQL:`, error);
        throw new Error("Failed to update user role in database");
    }
  }
}