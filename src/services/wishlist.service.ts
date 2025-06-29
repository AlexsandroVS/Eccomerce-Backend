import prisma from '../config/db.config';

export const WishlistService = {
  async addToWishlist(user_id: string, product_id: string) {
    return await prisma.user.update({
      where: { id: user_id },
      data: {
        wishlist: {
          connect: { id: product_id }
        }
      },
      include: { wishlist: true }
    });
  },

  async removeFromWishlist(user_id: string, product_id: string) {
    return await prisma.user.update({
      where: { id: user_id },
      data: {
        wishlist: {
          disconnect: { id: product_id }
        }
      },
      include: { wishlist: true }
    });
  },

  async getWishlist(user_id: string) {
    const user = await prisma.user.findUnique({
      where: { id: user_id },
      include: {
        wishlist: {
          include: {
            images: {
              where: { is_primary: true },
              take: 1
            }
          }
        }
      }
    });

    return user?.wishlist ?? [];
  }
};
