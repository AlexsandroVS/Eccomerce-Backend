import { Request, Response } from 'express';
import { InventoryLogService } from '../services/inventoryLog.service';

export const InventoryLogController = {
  async create(req: Request, res: Response) {
    try {
      const log = await InventoryLogService.create(req.body);
      res.status(201).json(log);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async adjust(req: Request, res: Response) {
    try {
      const log = await InventoryLogService.adjustStock(req.body);
      res.status(201).json({ message: 'Ajuste registrado', log });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async findAll(req: Request, res: Response) {
    try {
      const { product_id, variant_id } = req.query;
      const logs = await InventoryLogService.findAll({
        product_id: product_id as string,
        variant_id: variant_id as string
      });
      res.json(logs);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
};
