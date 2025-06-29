import { RequestHandler } from 'express';
import { AuthService } from '../services/auth.service';
import redis from '../config/redis.config';

interface JwtPayload {
  id: string;
  email: string;
  roles: string[];
  iat: number;
  exp: number;
}

// Extender la interfaz Request para incluir el usuario
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authMiddleware: RequestHandler = async (req, res, next) => {
  try {
    // Obtener el token de la cookie
    const token = req.cookies.token;

    if (!token) {
      res.status(401).json({ error: 'No se proporcionó un token de autenticación' });
      return;
    }

    // Verificar si el token está en la lista negra de Redis
    const isBlacklisted = await redis.get(`bl_${token}`);
    if (isBlacklisted) {
      res.status(401).json({ error: 'Token inválido o expirado' });
      return;
    }

    // Verificar y decodificar el token usando el servicio
    const decoded = await AuthService.validateToken(token) as JwtPayload;
    if (!decoded || !decoded.id) {
      res.status(401).json({ error: 'Token inválido' });
      return;
    }

    // Obtener el usuario usando el servicio de autenticación
    const user = await AuthService.getUserById(decoded.id);
    if (!user) {
      res.status(401).json({ error: 'Usuario no encontrado' });
      return;
    }

    // Verificar si el usuario está activo
    if (!user.is_active) {
      res.status(401).json({ error: 'Usuario inactivo' });
      return;
    }

    // Agregar el usuario a la request
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Invalid token') {
        res.status(401).json({ error: 'Token inválido o expirado' });
        return;
      }
      if (error.message === 'Token expired') {
        res.status(401).json({ error: 'Token expirado' });
        return;
      }
      if (error.message === 'User not found') {
        res.status(401).json({ error: 'Usuario no encontrado' });
        return;
      }
    }
    console.error('Error en auth middleware:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
    return;
  }
};

// Middleware para verificar roles
export const checkRole = (roles: string[]): RequestHandler => {
  return (req, res, next) => {
    const user = req.user;
    if (!user) {
      res.status(401).json({ error: 'No autorizado' });
      return;
    }

    const userRoles = user.roles.map((r: any) => r.role);
    if (!roles.some(role => userRoles.includes(role))) {
      res.status(403).json({ error: 'No tiene permisos para realizar esta acción' });
      return;
    }

    next();
  };
};
