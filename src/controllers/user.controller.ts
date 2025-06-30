import { Request, Response } from 'express';
import prisma from '../config/db.config';
import bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

// Listar usuarios (con filtro opcional por rol, paginación y búsqueda)
export async function listUsers(req: Request, res: Response) {
  try {
    const { role, page = '1', pageSize = '10', search = '' } = req.query;
    let where: any = {};
    if (role && typeof role === 'string' && Object.values(Role).includes(role as Role)) {
      where.roles = { some: { role: role as Role } };
    }
    if (search && typeof search === 'string' && search.trim() !== '') {
      where.OR = [
        { full_name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { roles: { some: { role: { contains: search, mode: 'insensitive' } } } }
      ];
    }
    const pageNum = Math.max(1, parseInt(page as string, 10));
    const pageSizeNum = Math.max(1, Math.min(100, parseInt(pageSize as string, 10)));
    const total = await prisma.user.count({ where });
    const users = await prisma.user.findMany({
      where,
      include: { roles: true },
      orderBy: { created_at: 'desc' },
      skip: (pageNum - 1) * pageSizeNum,
      take: pageSizeNum
    });
    res.json({ users, total, page: pageNum, pageSize: pageSizeNum });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

// Obtener usuario por ID
export async function getUserById(req: Request, res: Response) {
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
}

// Crear usuario
export async function createUser(req: Request, res: Response) {
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
        roles: { create: (roles as string[]).map(role => ({ role: role as Role, permissions: {} })) }
      },
      include: { roles: true }
    });
    res.status(201).json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

// Actualizar usuario
export async function updateUser(req: Request, res: Response) {
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
      await prisma.userRole.deleteMany({ where: { user_id: id } });
      data.roles = { create: (roles as string[]).map(role => ({ role: role as Role, permissions: {} })) };
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
}

// Eliminar usuario
export async function deleteUser(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await prisma.userRole.deleteMany({ where: { user_id: id } });
    await prisma.user.delete({ where: { id } });
    res.json({ message: 'Usuario eliminado' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
} 