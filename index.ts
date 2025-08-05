import express from 'express';
import path from 'path';
import userRouter from './src/users/infrastructure/Routers';
import plantRouter from './src/plants/interfasces/Routers';
import cartRouter from './src/cart/interfasces/Routers';
import pool from './src/core/db_MySQL'; 
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

// Esta configuración para servir imágenes está bien
app.use('/uploads', express.static(path.join(__dirname, 'src/uploads')));

// Registrar rutas (esto no cambia)
app.use('/api/v1', userRouter);
app.use('/api/v2', plantRouter);
app.use('/api/v3', cartRouter);

// Función para iniciar el servidor
async function startServer() {
  // Declara la variable de conexión aquí para que sea accesible en el `finally`
  let connection; 

  try {
    // CAMBIO CLAVE 2: Obtener una conexión del pool para la comprobación inicial
    connection = await pool.getConnection();
    console.log('✅ Database connection successful for initial check!');

    // Verificar si existe la tabla users (esto no cambia)
    const [tables] = await connection.execute('SHOW TABLES LIKE "users"');
    if (Array.isArray(tables) && tables.length > 0) {
      console.log('✅ Users table found!');
    } else {
      console.warn('⚠️ Users table not found!');
    }

  } catch (error) {
    console.error('❌ Failed to connect to database during startup:', error);
    process.exit(1); // Si la DB no funciona, el servidor no debe arrancar
  } finally {
    // CAMBIO CLAVE 3: Liberar la conexión para devolverla al pool
    // Es crucial hacer esto para no dejar una conexión "colgada" después del arranque.
    if (connection) {
      connection.release();
      console.log('✅ Initial check connection released back to the pool.');
    }
  }

  // Si la conexión fue exitosa, iniciar el servidor Express
  const PORT = process.env.PORT ?? 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

// Iniciar el servidor
startServer();