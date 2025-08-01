import express from 'express';
import path from 'path';
import userRouter from './src/users/infrastructure/Routers';
import plantRouter from './src/plants/interfasces/Routers';
import cartRouter from './src/cart/interfasces/Routers';
import { MySQLClient } from './src/core/db_MySQL';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Registrar rutas
app.use('/api/v1', userRouter);
app.use('/api/v2', plantRouter)
app.use('/api/v3', cartRouter)

// Función para iniciar el servidor
async function startServer() {
  try {
    // Verificar conexión a la base de datos
    const connection = await MySQLClient.getInstance();
    console.log('✅ Database connection successful!');

    // Verificar si existe la tabla users
    const [tables] = await connection.execute('SHOW TABLES LIKE "users"');
    if (Array.isArray(tables) && tables.length > 0) {
      console.log('✅ Users table found!');
    } else {
      console.warn('⚠️ Users table not found!');
    }

    // Iniciar servidor
    const PORT = process.env.PORT ?? 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();