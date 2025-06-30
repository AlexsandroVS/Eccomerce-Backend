import { Router } from "express";
import { PaymentController } from "../controllers/payment.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

// Wrapper universal para middlewares asíncronos
const asyncHandler = (fn: any) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const router = Router();

// Middleware para webhooks (sin autenticación)
router.post("/webhook", asyncHandler(PaymentController.webhook));

// Rutas protegidas (requieren autenticación)
router.use(authMiddleware);

// Crear PaymentIntent
router.post("/create", asyncHandler(PaymentController.createPayment));

// Reembolsar pago
router.post("/refund", asyncHandler(PaymentController.refundPayment));

// Obtener pagos de una orden
router.get("/order/:orderId", asyncHandler(PaymentController.getOrderPayments));

// Obtener un pago específico
router.get("/:paymentId", asyncHandler(PaymentController.getPayment));

// Listar todos los pagos (admin)
router.get("/", asyncHandler(PaymentController.listPayments));

export default router; 