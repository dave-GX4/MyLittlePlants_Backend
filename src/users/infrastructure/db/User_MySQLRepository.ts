import { MySQLClient } from "../../../core/db_MySQL";
import { User } from "../../domain/entities/User";
import { EmailValue } from "../../domain/entities/objectValues/Email_Value";
import { NameValue } from "../../domain/entities/objectValues/Name_Value";
import { NotFoundError } from "../../domain/entities/objectValues/NotFoundError";
import { PasswordValue } from "../../domain/entities/objectValues/Password_Value";
import { PhoneValue } from "../../domain/entities/objectValues/Phone_Value";
import { UserRepository } from "../../domain/User_Repository";

export class UserMySQLRepository implements UserRepository {
  private async getConnection() {
    return await MySQLClient.getInstance();
  }

  async create(user: User): Promise<void> {
    const connection = await this.getConnection();
      
    try {
        console.log('Attempting to create user in database:', {
            name: user.name.value,
            email: user.email.value,
            hasPhone: !!user.phone
        });

        await connection.execute(
            `INSERT INTO users (name, email, password, phone) 
            VALUES (?, ?, ?, ?)`,
            [
                user.name.value,
                user.email.value,
                user.password.value,
                user.phone?.value ?? null,
            ]
        );
        console.log('User inserted successfully in database');
    } catch (error) {
        console.error("Error creating user in MySQL:", error);
        if (error instanceof Error) {
            throw new Error(`Database error: ${error.message}`);
        }
        throw new Error("Failed to create user in database");
    }
  }

  async finedByEmail(email: string): Promise<User | null> {
      const connection = this.getConnection();
      
      const conn = await connection;
    try {
      const [rows]: any = await conn.execute(
        `SELECT * FROM users WHERE email = ?`,
        [email]
      );

      if (rows.length === 0) {
        return null; // No user found with the given email
      }

      const userData = rows[0];
      return new User(
        new NameValue(userData.name),
        new EmailValue(userData.email),
        new PasswordValue(userData.password),
        userData.phone ? new PhoneValue(userData.phone) : undefined,
        userData.id // Asegúrate de que tu entidad User acepta el ID en el constructor
      );
    } catch (error) {
      console.error("Error fetching user by email from MySQL:", error);
      throw new Error("Failed to fetch user by email from database");
    }
  }

  async getById(id: number): Promise<User> {
    const connection = await this.getConnection();
    
    try {
      const [rows]: any = await connection.execute(
        `SELECT * FROM users WHERE id = ?`,
        [id]
      );

      if (rows.length === 0) {
        throw new NotFoundError(`User with id ${id} not found in database`);
      }
      
      const userData = rows[0];
      return new User(
        new NameValue(userData.name),
        new EmailValue(userData.email),
        new PasswordValue(userData.password),
        userData.phone ? new PhoneValue(userData.phone) : undefined,
        userData.id // Asegúrate de que tu entidad User acepta el ID en el constructor
      );
    } catch (error) {
      console.error("Error fetching user from MySQL:", error);
      // Relanza el error si ya es un NotFoundError
      if (error instanceof NotFoundError) throw error;
      throw new Error("Failed to fetch user from database");
    }
  }

  async getAll(): Promise<User[]> {
    const connection = await this.getConnection();
    
    try {
      const [rows]: any = await connection.execute(
        `SELECT * FROM users`
      );

      return rows.map((userData: any) => 
        new User(
          new NameValue(userData.name),
          new EmailValue(userData.email),
          new PasswordValue(userData.password),
          userData.phone ? new PhoneValue(userData.phone) : undefined
        )
      );
    } catch (error) {
      console.error("Error fetching users from MySQL:", error);
      throw new Error("Failed to fetch users from database");
    }
  }

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

  async update(user: User): Promise<void> {
      if (!user.id) throw new Error("User ID is required for update");
      
      const connection = await this.getConnection();
      
      try {
        // Construir la consulta SQL dinámicamente
        const updateFields: string[] = [];
        const values: any[] = [];

        if (user.name) {
          updateFields.push('name = ?');
          values.push(user.name.value);
        }
        if (user.email) {
          updateFields.push('email = ?');
          values.push(user.email.value);
        }
        if (user.password) {
          updateFields.push('password = ?');
          values.push(user.password.value);
        }
        // El teléfono puede ser null
        updateFields.push('phone = ?');
        values.push(user.phone?.value ?? null);

        // Agregar el ID al final del array de valores
        values.push(user.id);

        const query = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
        
        console.log('Executing update query:', query);
        console.log('With values:', values);

        await connection.execute(query, values);
      } catch (error) {
        console.error("Error updating user in MySQL:", error);
        throw new Error("Failed to update user in database");
      }
  }
}