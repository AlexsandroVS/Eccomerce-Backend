import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';

export const ProductController = {
  async create(req: Request, res: Response) {
    try {
      const product = await ProductService.create(req.body);
      res.status(201).json(product);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const identifier = req.params.id; // puede ser id o sku
      const updated = await ProductService.updateByIdOrSku(identifier, req.body);
      res.json(updated);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const identifier = req.params.id; // puede ser id o sku
      const product = await ProductService.findByIdOrSku(identifier);
      res.json(product);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  },

  async getBySlug(req: Request, res: Response) {
    try {
      const slug = req.params.slug;
      const product = await ProductService.findBySlug(slug);
      res.json(product);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  },

  async list(req: Request, res: Response) {
    try {
      const includeInactive = req.query.includeInactive === 'true';
      const products = await ProductService.list(includeInactive);
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async activate(req: Request, res: Response) {
    try {
      const identifier = req.params.id; // puede ser id o sku
      const activated = await ProductService.activateByIdOrSku(identifier);
      res.json({ message: 'Producto activado', product: activated });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async deactivate(req: Request, res: Response) {
    try {
      const identifier = req.params.id; // puede ser id o sku
      const deactivated = await ProductService.deactivateByIdOrSku(identifier);
      res.json({ message: 'Producto desactivado', product: deactivated });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async softDelete(req: Request, res: Response) {
    try {
      const identifier = req.params.id; // puede ser id o sku
      const deleted = await ProductService.deleteByIdOrSku(identifier);
      res.json({ message: 'Producto eliminado (soft delete)', product: deleted });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async restore(req: Request, res: Response) {
    try {
      const identifier = req.params.id; // puede ser id o sku
      const restored = await ProductService.restoreByIdOrSku(identifier);
      res.json({ message: 'Producto restaurado', product: restored });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async permanentDelete(req: Request, res: Response) {
    try {
      const identifier = req.params.id; // puede ser id o sku
      await ProductService.permanentDeleteByIdOrSku(identifier);
      res.json({ message: 'Producto eliminado permanentemente' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async listDeleted(_req: Request, res: Response) {
    try {
      const deletedProducts = await ProductService.listDeleted();
      res.json(deletedProducts);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getCount(req: Request, res: Response) {
    try {
      const includeInactive = req.query.includeInactive === 'true';
      const includeDeleted = req.query.includeDeleted === 'true';
      const count = await ProductService.count(includeInactive, includeDeleted);
      res.json({ count });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async uploadImage(req: Request, res: Response) {
    try {
      const productId = req.params.id;
      const file = req.file;
      if (!file) throw new Error('Archivo no recibido');
      
      const url = `/uploads/products/${productId}/${file.filename}`;
      const image = await ProductService.addImage({
        productId,
        url,
        alt_text: req.body.alt_text,
        is_primary: req.body.is_primary === 'true',
      });
      
      res.status(201).json(image);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async removeImage(req: Request, res: Response) {
    try {
      const imageId = req.params.imageId;
      await ProductService.removeImage(imageId);
      res.json({ message: 'Imagen eliminada' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
};