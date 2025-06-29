import { Request, Response } from 'express';
import { WishlistService } from '../services/wishlist.service';

export const WishlistController = {
  async add(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { product_id } = req.body;
      const updated = await WishlistService.addToWishlist(userId, product_id);
      res.status(200).json({ message: 'Agregado al wishlist', wishlist: updated.wishlist });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async remove(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { product_id } = req.body;
      const updated = await WishlistService.removeFromWishlist(userId, product_id);
      res.status(200).json({ message: 'Eliminado del wishlist', wishlist: updated.wishlist });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async get(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const wishlist = await WishlistService.getWishlist(userId);
      res.status(200).json(wishlist);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
};
