import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
    user?: { id: number; email: string; role: string; };
}

/**
 * Su única responsabilidad es verificar el JWT y adjuntar el payload del usuario a 'req'.
 * No le importa el rol.
 */
export const isAuthenticated = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            res.status(401).json({ error: 'Acceso denegado. Se requiere un token.' });
            return;
        }

        const secretKey = process.env.JWT_SECRET!; // Verifica que existe
        const decodedPayload = jwt.verify(token, secretKey);
        req.user = decodedPayload as any;

        next();

    } catch (error) {
        res.status(401).json({ error: 'Token no válido o expirado.' });
    }
};

/**
    * Middleware de AUTORIZACIÓN.
    * Se usa *después* de isAuthenticated.
    * Comprueba si el usuario autenticado tiene uno de los roles permitidos.
    * @param allowedRoles Un array de roles que tienen permiso.
*/
export const hasRole = (allowedRoles: string[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!req.user || !req.user.role) {
            res.status(403).json({ error: 'Acceso denegado. No se pudo determinar el rol.' });
            return;
        }

        const userRole = req.user.role;
        if (allowedRoles.includes(userRole)) {
            next();// El rol esta permitido
        } else {
            res.status(403).json({ error: 'Acceso denegado. No tienes los permisos necesarios.' });
        }
    };
};