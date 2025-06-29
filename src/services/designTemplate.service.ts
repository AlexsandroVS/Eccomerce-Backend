import prisma from "../config/db.config";
import { generateSlug } from "../utils/slug.utils";
import {
  DesignTemplateCreateData,
  DesignTemplateUpdateData,
} from "../types/designTemplate.types";

export const DesignTemplateService = {
  async create(data: DesignTemplateCreateData) {
    const slug = data.slug || (await generateSlug(data.name, "template"));

    let totalPrice = 0;
    const productsData = [];

    for (const item of data.products) {
      const product = await prisma.product.findUnique({
        where: { id: item.product_id },
      });

      if (!product || !product.is_active) {
        throw new Error(`Producto inválido: ${item.product_id}`);
      }

      // Si es VARIABLE, obtener precio mínimo de sus variantes
      let basePrice = product.base_price ?? 0;

      if (product.type === "VARIABLE") {
        const variant = await prisma.productVariant.findFirst({
          where: { product_id: product.id, is_active: true },
          orderBy: { price: "asc" },
        });
        basePrice = variant?.price ?? 0;
      }

      totalPrice += basePrice * (item.quantity || 1);

      productsData.push({
        product_id: item.product_id,
        quantity: item.quantity ?? 1,
        is_optional: item.is_optional ?? false,
        notes: item.notes,
      });
    }

    const finalPrice = data.discount
      ? totalPrice * (1 - data.discount)
      : totalPrice;

    return await prisma.designTemplate.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        room_type: data.room_type,
        style: data.style,
        discount: data.discount,
        total_price: finalPrice,
        cover_image_url: data.cover_image_url,
        featured: data.featured ?? false,
        products: { createMany: { data: productsData } },
      },
      include: { products: true },
    });
  },

  async update(id: string, data: DesignTemplateUpdateData) {
    let productsData;

    if (data.products) {
      productsData = {
        deleteMany: {}, // elimina todos los productos relacionados
        createMany: {
          data: data.products.map((item) => ({
            product_id: item.product_id,
            quantity: item.quantity ?? 1,
            is_optional: item.is_optional ?? false,
            notes: item.notes,
          })),
        },
      };
    }

    return await prisma.designTemplate.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        room_type: data.room_type,
        style: data.style,
        discount: data.discount,
        cover_image_url: data.cover_image_url,
        featured: data.featured,
        updated_at: new Date(),
        products: productsData, 
      },
      include: { products: true },
    });
  },

  async getBySlug(slug: string) {
    const template = await prisma.designTemplate.findUnique({
      where: { slug },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!template || !template.is_active) {
      throw new Error("Template no encontrado");
    }

    return template;
  },

  async list() {
    return await prisma.designTemplate.findMany({
      where: { is_active: true },
      include: {
        products: true,
      },
      orderBy: { created_at: "desc" },
    });
  },

  async softDelete(id: string) {
    return await prisma.designTemplate.update({
      where: { id },
      data: {
        is_active: false,
        deleted_at: new Date(),
      },
    });
  },
};
