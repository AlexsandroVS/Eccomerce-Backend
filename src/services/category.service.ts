import prisma from "../config/db.config";
import { CategoryCreateData } from "../types/category.types";

export const CategoryService = {
  async create(data: CategoryCreateData) {
    // Verificar slug único
    const existing = await prisma.category.findUnique({
      where: { slug: data.slug },
    });

    if (existing) {
      throw new Error("El slug ya está en uso");
    }

    // Verificar parent_id válido
    if (data.parent_id) {
      const parent = await prisma.category.findUnique({
        where: { id: data.parent_id },
      });

      if (!parent || !parent.is_active) {
        throw new Error("La categoría padre no existe o está inactiva");
      }
    }

    return await prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        parent_id: data.parent_id,
        attributes_normalized: data.attributes_normalized,
      },
    });
  },

  async findAll(parent_id?: number | "root") {
    return await prisma.category.findMany({
      where: {
        deleted_at: null,
        parent_id: parent_id === "root" ? null : parent_id,
      },
      orderBy: { created_at: "desc" },
    });
  },

  async findById(id: number) {
    const category = await prisma.category.findUnique({
      where: {
        id,
        is_active: true,
        deleted_at: null,
      },
    });

    if (!category) {
      throw new Error("Categoría no encontrada");
    }

    return category;
  },

  async deactivate(id: number) {
    // Verificar hijos activos
    const hasActiveChildren = await prisma.category.count({
      where: {
        parent_id: id,
        is_active: true,
        deleted_at: null,
      },
    });

    if (hasActiveChildren > 0) {
      throw new Error("No se puede desactivar: tiene subcategorías activas");
    }

    return await prisma.category.update({
      where: { id },
      data: {
        is_active: false
      },
    });
  },

  async activate(id: number) {
    const category = await prisma.category.findUnique({ where: { id } });

    if (!category) {
      throw new Error("Categoría no encontrada");
    }

    return await prisma.category.update({
      where: { id },
      data: {
        is_active: true,
        deleted_at: null,
      },
    });
  },

  async delete(id: number) {
    const hasChildren = await prisma.category.count({
      where: {
        parent_id: id,
      },
    });

    if (hasChildren > 0) {
      throw new Error(
        "No se puede eliminar: la categoría tiene subcategorías relacionadas"
      );
    }

    const relatedProducts = await prisma.category.findUnique({
      where: { id },
      include: { products: true },
    });

    if (relatedProducts && relatedProducts.products.length > 0) {
      throw new Error(
        "No se puede eliminar: la categoría está asociada a uno o más productos"
      );
    }

    // Eliminar categoría si no tiene hijos ni productos
    return await prisma.category.delete({
      where: { id },
    });
  },

  async checkSlug(slug: string) {
    const existing = await prisma.category.findUnique({
      where: { slug },
    });

    return !existing;
  },
};
