import prisma from '../config/db.config';
import { ProductVariantCreateData, ProductVariantUpdateData } from '../types/productVariant.types';

interface ProductVariantImageData {
  variantId: string;
  url: string;
  alt_text?: string;
  is_primary?: boolean;
}

export const ProductVariantService = {
  async create(data: ProductVariantCreateData) {
    return await prisma.productVariant.create({
      data: {
        product_id: data.product_id,
        sku_suffix: data.sku_suffix,
        stock: data.stock,
        price: data.price,
        min_stock: data.min_stock ?? 5,
        is_active: data.is_active ?? true,
        attributes: data.attributes
      },
    });
  },

  async update(id: string, data: ProductVariantUpdateData) {
    return await prisma.productVariant.update({
      where: { id },
      data: {
        sku_suffix: data.sku_suffix,
        stock: data.stock,
        price: data.price,
        min_stock: data.min_stock,
        is_active: data.is_active,
        attributes: data.attributes
      },
    });
  },

  async delete(id: string) {
    return await prisma.productVariant.update({
      where: { id },
      data: {
        is_active: false,
        deleted_at: new Date(),
      },
    });
  },

  async list(product_id: string) {
    return await prisma.productVariant.findMany({
      where: {
        product_id,
        is_active: true
      },
      orderBy: { created_at: 'desc' }
    });
  },

  async findById(id: string) {
    const variant = await prisma.productVariant.findUnique({
      where: { id },
    });

    if (!variant || !variant.is_active) {
      throw new Error('Variante no encontrada');
    }

    return variant;
  },

  async addImage(imageData: ProductVariantImageData) {
    // Verificar que la variante existe y no está eliminada
    const variant = await prisma.productVariant.findFirst({
      where: {
        id: imageData.variantId,
        is_active: true,
        deleted_at: null,
      },
    });

    if (!variant) throw new Error("Variante no encontrada");

    if (imageData.is_primary) {
      await prisma.productVariantImage.updateMany({
        where: { variant_id: imageData.variantId, is_primary: true },
        data: { is_primary: false },
      });
    }

    return await prisma.productVariantImage.create({
      data: {
        variant_id: imageData.variantId,
        url: imageData.url,
        alt_text: imageData.alt_text,
        is_primary: imageData.is_primary ?? false,
      },
    });
  },

  async removeImage(imageId: string) {
    const image = await prisma.productVariantImage.findUnique({
      where: { id: imageId },
    });

    if (!image) throw new Error("Imagen no encontrada");

    return await prisma.productVariantImage.delete({
      where: { id: imageId },
    });
  }
};
