import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from the same directory
const envPath = path.resolve(__dirname, '.env');
console.log('Loading .env from:', envPath);
dotenv.config({ path: envPath });

export class MySQLClient {
    private static instance: mysql.Connection | null = null;

    private constructor() {}

    public static async getInstance(): Promise<mysql.Connection> {
        try {
            if (!MySQLClient.instance) {
                // Verify all required environment variables are present
                const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
                const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
                
                if (missingVars.length > 0) {
                    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
                }

                MySQLClient.instance = await mysql.createConnection({
                    host: process.env.DB_HOST,
                    user: process.env.DB_USER,
                    password: process.env.DB_PASSWORD,
                    database: process.env.DB_NAME,
                    port: parseInt(process.env.DB_PORT || '3306')
                });

                console.log('✅ Database configuration loaded:', {
                    host: process.env.DB_HOST,
                    user: process.env.DB_USER,
                    database: process.env.DB_NAME,
                    port: process.env.DB_PORT
                });

            }
            return MySQLClient.instance;
        } catch (error) {
            console.error('❌ Database connection error:', error);
            console.log('🔍 Password being used:', process.env.DB_PASSWORD);
            throw error;
        }
    }
}