import { Request, Response } from 'express';
import { OrderService } from '../services/order.service';

export const OrderController = {
  async create(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id; // Desde middleware de auth
      const order = await OrderService.create({ ...req.body, user_id: userId });
      res.status(201).json({ success: true, data: order });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const order = await OrderService.getById(id);
      res.json(order);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  },

  async listByUser(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const orders = await OrderService.listByUser(userId);
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async listAll(_req: Request, res: Response) {
    try {
      const orders = await OrderService.listAll();
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async cancel(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const cancelled = await OrderService.cancel(id);
      res.json({ message: 'Orden cancelada', order: cancelled });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
};
