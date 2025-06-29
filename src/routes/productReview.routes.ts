import { Router } from "express";
import { ProductReviewController } from "../controllers/productReview.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", authMiddleware, ProductReviewController.create);
router.get("/:product_id", ProductReviewController.findByProduct);
router.get("/:product_id/average", ProductReviewController.average);

export default router;
