import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { UserRegisterData, UserLoginData } from '../types/auth.types';
import { CookieOptions } from 'express';

const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'none',
  maxAge: 4 * 24 * 60 * 60 * 1000, // 4 días
  path: '/',
};

export const AuthController = {
  async register(req: Request, res: Response) {
    try {
      const userData: UserRegisterData = req.body;
      const authResponse = await AuthService.register(userData);

      res.cookie('token', authResponse.token, COOKIE_OPTIONS);
      res.status(201).json({ 
        user: authResponse.user,
        message: 'Usuario registrado exitosamente'
      });
    } catch (error: any) {
      console.error('Error en registro:', error);
      res.status(400).json({ 
        error: error.message || 'Error al registrar usuario'
      });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const loginData: UserLoginData = req.body;
      const authResponse = await AuthService.login(loginData);

      res.cookie('token', authResponse.token, COOKIE_OPTIONS);
      res.json({ 
        user: authResponse.user,
        message: 'Inicio de sesión exitoso'
      });
    } catch (error: any) {
      console.error('Error en login:', error);
      res.status(401).json({ 
        error: error.message || 'Credenciales inválidas'
      });
    }
  },

  async logout(_req: Request, res: Response) {
    try {
      res.clearCookie('token', {
        ...COOKIE_OPTIONS,
        maxAge: 0
      });
      
      res.json({ 
        message: 'Sesión cerrada exitosamente'
      });
    } catch (error: any) {
      console.error('Error en logout:', error);
      res.status(500).json({ 
        error: 'Error al cerrar sesión'
      });
    }
  },

  async profile(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      if (!user) {
        return res.status(401).json({ error: 'Usuario no encontrado' });
      }
      
      res.json({
        user,
        message: 'Perfil obtenido exitosamente'
      });
    } catch (error: any) {
      console.error('Error en profile:', error);
      res.status(error.status || 500).json({ 
        error: error.message || 'Error al obtener perfil'
      });
    }
  }
};
