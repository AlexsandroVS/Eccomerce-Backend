import prisma from "../config/db.config";
import {
  ProductCreateData,
  ProductUpdateData,
  ProductImageData,
} from "../types/product.types";
import { generateSlug } from "../utils/slug.utils";

export const ProductService = {
  async create(data: ProductCreateData) {
    const slug = data.slug || (await generateSlug(data.name, "product"));

    // Convertir atributos (si existen) a array de objetos { name, value }
    const attributesArray: { name: string; value: string }[] = data.attributes
      ? Object.entries(data.attributes).map(([name, value]) => ({
          name,
          value,
        }))
      : [];

    const created = await prisma.product.create({
      data: {
        name: data.name,
        sku: data.sku,
        slug,
        description: data.description,
        type: data.type || "SIMPLE",
        base_price: data.base_price,
        stock: data.stock,
        min_stock: data.min_stock,
        attributes: {
          create: attributesArray,
        },
        categories: {
          connect: data.categories.map((id) => ({ id })),
        },
      },
      include: {
        categories: true,
        images: true,
        attributes: true,
        variants: true,
      },
    });

    return created;
  },

  async updateByIdOrSku(identifier: string, data: ProductUpdateData) {
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id: identifier }, { sku: identifier }],
        deleted_at: null, // Solo productos no eliminados
      },
      include: {
        attributes: true,
      },
    });

    if (!product) throw new Error("Producto no encontrado");

    // Convierte array de atributos a objeto { [name]: value }
    function attributesArrayToObject(
      attributes: { name: string; value: string }[] = []
    ): Record<string, string> {
      return attributes.reduce((acc, attr) => {
        acc[attr.name] = attr.value;
        return acc;
      }, {} as Record<string, string>);
    }

    const existingAttributes = attributesArrayToObject(product.attributes);
    const incomingAttributes = data.attributes || {};
    const mergedAttributes = { ...existingAttributes, ...incomingAttributes };

    // Convertir a array { name, value }
    const attributesArray: { name: string; value: string }[] = Object.entries(
      mergedAttributes
    ).map(([name, value]) => ({ name, value }));

    const updated = await prisma.product.update({
      where: { id: product.id },
      data: {
        name: data.name,
        slug: data.slug,
        sku: data.sku,
        description: data.description,
        type: data.type,
        base_price: data.base_price,
        stock: data.stock,
        min_stock: data.min_stock,
        categories: data.categories
          ? { set: data.categories.map((id) => ({ id })) }
          : undefined,
        attributes: data.attributes
          ? {
              deleteMany: {}, // Elimina todos los atributos previos
              create: attributesArray,
            }
          : undefined,
      },
      include: {
        categories: true,
        images: true,
        attributes: true,
        variants: true,
      },
    });

    return updated;
  },

  async findByIdOrSku(identifier: string) {
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id: identifier }, { sku: identifier }],
        deleted_at: null,
      },
      include: {
        categories: true,
        images: true,
        attributes: true,
        variants: true,
      },
    });

    if (!product) {
      throw new Error("Producto no encontrado");
    }

    return product;
  },

  async findBySlug(slug: string) {
    const product = await prisma.product.findUnique({
      where: {
        slug,
        deleted_at: null,
      },
      include: {
        categories: true,
        images: true,
        attributes: true,
        variants: true,
      },
    });

    if (!product || !product.is_active) {
      throw new Error("Producto no encontrado");
    }

    return product;
  },

  async list(_includeInactive: boolean = false) {
    return await prisma.product.findMany({
      include: {
        categories: true,
        images: true,
        attributes: true,
        variants: true,
      },
      orderBy: { created_at: "desc" },
    });
  },

  // MÉTODO PARA ACTIVAR PRODUCTO
  async activateByIdOrSku(identifier: string) {
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id: identifier }, { sku: identifier }],
        deleted_at: null,
      },
    });

    if (!product) throw new Error("Producto no encontrado");

    return await prisma.product.update({
      where: { id: product.id },
      data: {
        is_active: true,
      },
      include: {
        categories: true,
        images: true,
        attributes: true,
        variants: true,
      },
    });
  },

  // MÉTODO PARA DESACTIVAR PRODUCTO (CORREGIDO)
  async deactivateByIdOrSku(identifier: string) {
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id: identifier }, { sku: identifier }],
        deleted_at: null,
      },
    });

    if (!product) throw new Error("Producto no encontrado");

    return await prisma.product.update({
      where: { id: product.id },
      data: {
        is_active: false,
      },
      include: {
        categories: true,
        images: true,
        attributes: true,
        variants: true,
      },
    });
  },

  // MÉTODO PARA ELIMINAR DEFINITIVAMENTE (SOFT DELETE)
  async deleteByIdOrSku(identifier: string) {
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id: identifier }, { sku: identifier }],
        deleted_at: null,
      },
    });

    if (!product) throw new Error("Producto no encontrado");

    return await prisma.product.update({
      where: { id: product.id },
      data: {
        deleted_at: new Date(),
        is_active: false, // También desactivar al eliminar
      },
    });
  },

  // MÉTODO PARA RESTAURAR PRODUCTO ELIMINADO
  async restoreByIdOrSku(identifier: string) {
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id: identifier }, { sku: identifier }],
        deleted_at: { not: null },
      },
    });

    if (!product) throw new Error("Producto eliminado no encontrado");

    return await prisma.product.update({
      where: { id: product.id },
      data: {
        deleted_at: null,
        is_active: true, // Activar al restaurar
      },
      include: {
        categories: true,
        images: true,
        attributes: true,
        variants: true,
      },
    });
  },

  // MÉTODO PARA ELIMINAR COMPLETAMENTE DE LA BASE DE DATOS
  async permanentDeleteByIdOrSku(identifier: string) {
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id: identifier }, { sku: identifier }],
      },
    });

    if (!product) throw new Error("Producto no encontrado");

    // Eliminar en orden para evitar errores de foreign key
    await prisma.productAttribute.deleteMany({
      where: { product_id: product.id },
    });

    await prisma.productImage.deleteMany({
      where: { product_id: product.id },
    });

    await prisma.productVariant.deleteMany({
      where: { product_id: product.id },
    });

    return await prisma.product.delete({
      where: { id: product.id },
    });
  },

  async addImage(imageData: ProductImageData) {
    // Verificar que el producto existe y no está eliminado
    const product = await prisma.product.findFirst({
      where: {
        id: imageData.productId,
        deleted_at: null,
      },
    });

    if (!product) throw new Error("Producto no encontrado");

    if (imageData.is_primary) {
      await prisma.productImage.updateMany({
        where: { product_id: imageData.productId, is_primary: true },
        data: { is_primary: false },
      });
    }

    return await prisma.productImage.create({
      data: {
        product_id: imageData.productId,
        url: imageData.url,
        alt_text: imageData.alt_text,
        is_primary: imageData.is_primary ?? false,
      },
    });
  },

  // MÉTODO PARA ELIMINAR IMAGEN
  async removeImage(imageId: string) {
    const image = await prisma.productImage.findUnique({
      where: { id: imageId },
    });

    if (!image) throw new Error("Imagen no encontrada");

    return await prisma.productImage.delete({
      where: { id: imageId },
    });
  },

  // MÉTODO PARA BUSCAR PRODUCTOS ELIMINADOS
  async listDeleted() {
    return await prisma.product.findMany({
      where: {
        deleted_at: { not: null },
      },
      include: {
        categories: true,
        images: true,
        attributes: true,
        variants: true,
      },
      orderBy: { deleted_at: "desc" },
    });
  },

  // MÉTODO PARA CONTAR PRODUCTOS
  async count(
    includeInactive: boolean = false,
    includeDeleted: boolean = false
  ) {
    const whereCondition: any = {};

    if (!includeDeleted) {
      whereCondition.deleted_at = null;
    }

    if (!includeInactive && !includeDeleted) {
      whereCondition.is_active = true;
    }

    return await prisma.product.count({
      where: whereCondition,
    });
  },
};
