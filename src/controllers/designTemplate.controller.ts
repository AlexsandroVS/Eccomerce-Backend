import { Request, Response } from 'express';
import { DesignTemplateService } from '../services/designTemplate.service';

export const DesignTemplateController = {
  async create(req: Request, res: Response) {
    try {
      const template = await DesignTemplateService.create(req.body);
      res.status(201).json(template);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updated = await DesignTemplateService.update(id, req.body);
      res.json(updated);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async getBySlug(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      const template = await DesignTemplateService.getBySlug(slug);
      res.json(template);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  },

  async list(_req: Request, res: Response) {
    try {
      const templates = await DesignTemplateService.list();
      res.json(templates);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async softDelete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await DesignTemplateService.softDelete(id);
      res.json({ message: 'Template desactivado', template: deleted });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
};
