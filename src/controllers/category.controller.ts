import { Request, Response } from "express";
import { CategoryService } from "../services/category.service";
import { CategoryCreateData } from "../types/category.types";

export const CategoryController = {
  async create(req: Request, res: Response) {
    try {
      const data: CategoryCreateData = req.body;
      const category = await CategoryService.create(data);
      res.status(201).json(category);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async findAll(req: Request, res: Response) {
    try {
      const parent_id = req.query.parent_id as string | undefined;

      let parsedParentId: number | "root" | undefined;

      if (parent_id === "root") {
        parsedParentId = "root";
      } else if (parent_id && !isNaN(parseInt(parent_id))) {
        parsedParentId = parseInt(parent_id);
      }

      const categories = await CategoryService.findAll(parsedParentId);
      res.json(categories);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async findById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const category = await CategoryService.findById(id);
      res.json(category);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  },

  async deactivate(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const category = await CategoryService.deactivate(id);
      res.json({ message: "Categoría desactivada", category });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async activate(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const category = await CategoryService.activate(id);
      res.json({ message: "Categoría activada", category });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const category = await CategoryService.delete(id);
      res.json({ message: "Categoría eliminada permanentemente", category });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async checkSlug(req: Request, res: Response) {
    try {
      const { slug } = req.query;

      if (typeof slug !== "string") {
        throw new Error("Parámetro slug inválido");
      }

      const available = await CategoryService.checkSlug(slug);
      res.json({ available });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },
};
