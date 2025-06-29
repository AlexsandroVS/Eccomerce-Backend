import { Router } from "express";
import { ProductVariantController } from "../controllers/productVariant.controller";
import { authMiddleware, checkRole } from "../middlewares/auth.middleware";
import { createMulterUploader } from "../utils/multer.utils";

const upload = createMulterUploader("variants");
const router = Router();

router.post(
  "/",
  authMiddleware,
  checkRole(["ADMIN"]),
  ProductVariantController.create
);
router.get("/product/:productId", ProductVariantController.listByProduct);
router.get("/:id", ProductVariantController.findById);
router.patch(
  "/:id",
  authMiddleware,
  checkRole(["ADMIN"]),
  ProductVariantController.update
);
router.delete(
  "/:id",
  authMiddleware,
  checkRole(["ADMIN"]),
  ProductVariantController.delete
);

// Subir imagen de variante
router.post(
  "/:id/images",
  authMiddleware,
  checkRole(["ADMIN"]),
  upload.single("image"),
  ProductVariantController.uploadImage
);

// Eliminar imagen de variante
router.delete(
  "/:id/images/:imageId",
  authMiddleware,
  checkRole(["ADMIN"]),
  ProductVariantController.removeImage
);

export default router;
