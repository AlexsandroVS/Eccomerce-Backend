import prisma from "../config/db.config";
import { ProductReviewCreateData } from "../types/productReview.types";

export const ProductReviewService = {
  async create(user_id: string, data: ProductReviewCreateData) {
    if (data.rating < 1 || data.rating > 5) {
      throw new Error("La calificación debe estar entre 1 y 5");
    }

    return await prisma.productReview.create({
      data: {
        product_id: data.product_id,
        user_id,
        rating: data.rating as any, // Forzar casteo si rating es tipo restringido
        comment: data.comment,
      },
    });
  },

  async findByProduct(product_id: string) {
    return await prisma.productReview.findMany({
      where: { product_id },
      orderBy: { created_at: "desc" },
    });
  },

  async getAverageRating(product_id: string): Promise<number> {
    const result = await prisma.$queryRaw<{ avg_rating: number | null }[]>`
    SELECT AVG(rating) as avg_rating
    FROM "ProductReview"
    WHERE product_id = ${product_id}
  `;

    return result[0]?.avg_rating ?? 0;
  },
};
