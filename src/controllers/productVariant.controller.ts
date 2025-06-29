import { Request, Response } from 'express';
import { ProductVariantService } from '../services/productVariant.service';
import prisma from '../config/db.config';

export const ProductVariantController = {
  create: async (req: Request, res: Response) => {
    try {
      const { product_id, sku_suffix, stock, price, min_stock, attributes } = req.body;

      // Validar campos requeridos
      if (!product_id) {
        res.status(400).json({ error: 'product_id es requerido' });
        return;
      }

      if (!stock || stock < 0) {
        res.status(400).json({ error: 'stock es requerido y debe ser mayor o igual a 0' });
        return;
      }

      // Obtener el producto para validar que existe y obtener el precio base
      const product = await prisma.product.findUnique({
        where: { id: product_id }
      });

      if (!product) {
        res.status(404).json({ error: 'Producto no encontrado' });
        return;
      }

      // Generar SKU suffix automáticamente si no se proporciona
      let finalSkuSuffix = sku_suffix;
      if (!finalSkuSuffix || finalSkuSuffix.trim() === '') {
        // Generar un SKU suffix basado en atributos o timestamp
        const timestamp = Date.now().toString().slice(-6);
        const attributeSuffix = attributes && Object.keys(attributes).length > 0 
          ? Object.values(attributes).join('-').toUpperCase()
          : 'VAR';
        finalSkuSuffix = `${attributeSuffix}-${timestamp}`;
      }

      // Usar el precio proporcionado o el precio base del producto
      const finalPrice = price !== undefined && price !== null ? price : (product.base_price || 0);

      // Preparar los datos para crear la variante
      const variantData = {
        product_id,
        sku_suffix: finalSkuSuffix,
        stock,
        price: finalPrice,
        min_stock: min_stock ?? 5,
        is_active: true,
        attributes: attributes || {}
      };

      const variant = await ProductVariantService.create(variantData);
      res.status(201).json(variant);
    } catch (error: any) {
      console.error('Error creating variant:', error);
      res.status(400).json({ error: error.message });
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const { sku_suffix, stock, price, min_stock, is_active, attributes } = req.body;

      // Validar que la variante existe
      const existingVariant = await prisma.productVariant.findUnique({
        where: { id }
      });

      if (!existingVariant) {
        res.status(404).json({ error: 'Variante no encontrada' });
        return;
      }

      // Preparar los datos de actualización
      const updateData: any = {};
      
      if (sku_suffix !== undefined) updateData.sku_suffix = sku_suffix;
      if (stock !== undefined) updateData.stock = stock;
      if (price !== undefined) updateData.price = price;
      if (min_stock !== undefined) updateData.min_stock = min_stock;
      if (is_active !== undefined) updateData.is_active = is_active;
      if (attributes !== undefined) updateData.attributes = attributes;

      const variant = await ProductVariantService.update(id, updateData);
      res.json(variant);
    } catch (error: any) {
      console.error('Error updating variant:', error);
      res.status(400).json({ error: error.message });
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const variant = await ProductVariantService.delete(id);
      res.json({ message: 'Variante desactivada', variant });
    } catch (error: any) {
      console.error('Error deleting variant:', error);
      res.status(400).json({ error: error.message });
    }
  },

  findById: async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const variant = await ProductVariantService.findById(id);
      res.json(variant);
    } catch (error: any) {
      console.error('Error finding variant:', error);
      res.status(404).json({ error: error.message });
    }
  },

  listByProduct: async (req: Request, res: Response) => {
    try {
      const productId = req.params.productId;
      const variants = await ProductVariantService.list(productId);
      res.json(variants);
    } catch (error: any) {
      console.error('Error listing variants:', error);
      res.status(500).json({ error: error.message });
    }
  },

  uploadImage: async (req: Request, res: Response) => {
    try {
      const variantId = req.params.id;
      const file = (req as any).file;
      if (!file) {
        res.status(400).json({ error: 'Archivo no recibido' });
        return;
      }
      
      const url = `/uploads/variants/${variantId}/${file.filename}`;
      const image = await ProductVariantService.addImage({
        variantId,
        url,
        alt_text: req.body.alt_text,
        is_primary: req.body.is_primary === 'true',
      });
      
      res.status(201).json(image);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  removeImage: async (req: Request, res: Response) => {
    try {
      const imageId = req.params.imageId;
      await ProductVariantService.removeImage(imageId);
      res.json({ message: 'Imagen eliminada' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
};
