import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

// Carga las variables de entorno (tu código para esto está bien)
const envPath = path.resolve(__dirname, '.env');
dotenv.config({ path: envPath });

// Verificación de variables de entorno
const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
}

// Configuración para el pool de conexiones
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || '3306'),
    waitForConnections: true,
    connectionLimit: 10, // Mantiene hasta 10 conexiones abiertas listas para usar
    queueLimit: 0
};

// Crea y exporta el pool. Esta será la única instancia en toda la app.
const pool = mysql.createPool(dbConfig);

console.log('✅ Database connection pool created successfully.');

export default pool;