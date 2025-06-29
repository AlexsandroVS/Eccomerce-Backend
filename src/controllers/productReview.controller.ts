import { Request, Response } from 'express';
import { ProductReviewService } from '../services/productReview.service';

export const ProductReviewController = {
  async create(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const review = await ProductReviewService.create(userId, req.body);
      res.status(201).json(review);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async findByProduct(req: Request, res: Response) {
    try {
      const { product_id } = req.params;
      const reviews = await ProductReviewService.findByProduct(product_id);
      res.json(reviews);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async average(req: Request, res: Response) {
    try {
      const { product_id } = req.params;
      const avg = await ProductReviewService.getAverageRating(product_id);
      res.json({ average: avg });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
};
