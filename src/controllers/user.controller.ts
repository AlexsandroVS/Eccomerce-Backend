import { Request, Response } from 'express';
import prisma from '../config/db.config';
import bcrypt from 'bcrypt';

export const UserController = {
  // Listar usuarios (con filtro opcional por rol)
  async list(req: Request, res: Response) {
    try {
      const { role } = req.query;
      const where = role ? { roles: { some: { role } } } : {};
      const users = await prisma.user.findMany({
        where,
        include: { roles: true },
        orderBy: { created_at: 'desc' }
      });
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener usuario por ID
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await prisma.user.findUnique({
        where: { id },
        include: { roles: true }
      });
      if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  // Crear usuario
  async create(req: Request, res: Response) {
    try {
      const { email, full_name, phone, password, roles } = req.body;
      if (!email || !full_name || !password || !roles || !Array.isArray(roles) || roles.length === 0) {
        return res.status(400).json({ error: 'Datos incompletos' });
      }
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) return res.status(409).json({ error: 'Email ya registrado' });
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          email,
          full_name,
          phone,
          password: hashedPassword,
          roles: { create: roles.map((role: string) => ({ role, permissions: {} })) }
        },
        include: { roles: true }
      });
      res.status(201).json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  // Actualizar usuario
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { full_name, phone, password, roles, is_active } = req.body;
      const data: any = {};
      if (full_name !== undefined) data.full_name = full_name;
      if (phone !== undefined) data.phone = phone;
      if (is_active !== undefined) data.is_active = is_active;
      if (password) data.password = await bcrypt.hash(password, 10);
      // Actualizar roles si se envían
      if (roles && Array.isArray(roles)) {
        // Eliminar roles actuales y crear nuevos
        await prisma.userRole.deleteMany({ where: { user_id: id } });
        data.roles = { create: roles.map((role: string) => ({ role, permissions: {} })) };
      }
      const user = await prisma.user.update({
        where: { id },
        data,
        include: { roles: true }
      });
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  // Eliminar usuario
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.userRole.deleteMany({ where: { user_id: id } });
      await prisma.user.delete({ where: { id } });
      res.json({ message: 'Usuario eliminado' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}; 