import { Request, Response } from "express";
import { PaymentService } from "../services/payment.service";
import { verifyWebhook } from "../config/stripe.config";

export const PaymentController = {
  // Crear un PaymentIntent
  async createPayment(req: Request, res: Response) {
    try {
      const { orderId, amount, currency, customerEmail, metadata } = req.body;

      if (!orderId || !amount || !currency) {
        return res.status(400).json({
          success: false,
          error: "orderId, amount y currency son requeridos"
        });
      }

      const result = await PaymentService.createPayment({
        orderId,
        amount: parseFloat(amount),
        currency,
        customerEmail,
        metadata
      });

      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: result.error
        });
      }

      return res.status(201).json({
        success: true,
        data: {
          payment: result.payment,
          clientSecret: result.clientSecret,
          paymentIntentId: result.paymentIntentId
        }
      });
    } catch (error) {
      console.error("Error in createPayment:", error);
      return res.status(500).json({
        success: false,
        error: "Error interno del servidor"
      });
    }
  },

  // Webhook de Stripe
  async webhook(req: Request, res: Response) {
    try {
      const signature = req.headers["stripe-signature"] as string;
      console.log("[WEBHOOK] Recibido webhook de Stripe");
      if (!signature) {
        console.error("[WEBHOOK] Stripe signature missing");
        return res.status(400).json({
          success: false,
          error: "Stripe signature missing"
        });
      }

      // Verificar el webhook
      const verifyResult = verifyWebhook(req.body, signature);
      if (!verifyResult.success || !verifyResult.event) {
        console.error("[WEBHOOK] Verificación fallida:", verifyResult.error);
        return res.status(400).json({
          success: false,
          error: verifyResult.error
        });
      }

      const event = verifyResult.event;
      console.log(`[WEBHOOK] Evento recibido: ${event.type}`);
      // Procesar diferentes tipos de eventos
      switch (event.type) {
        case "payment_intent.succeeded":
          console.log(`[WEBHOOK] Procesando payment_intent.succeeded para payment_intent_id: ${event.data.object.id}`);
          await PaymentService.confirmPayment(event.data.object.id);
          break;
        case "payment_intent.payment_failed":
          console.log(`[WEBHOOK] Procesando payment_intent.payment_failed para payment_intent_id: ${event.data.object.id}`);
          await PaymentService.confirmPayment(event.data.object.id);
          break;
        case "charge.refunded":
          console.log(`[WEBHOOK] Procesando charge.refunded para charge_id: ${event.data.object.id}`);
          // El reembolso ya se procesa en el servicio
          break;
        default:
          console.log(`[WEBHOOK] Evento no manejado: ${event.type}`);
      }

      return res.status(200).json({ received: true });
    } catch (error) {
      console.error("[WEBHOOK] Error en webhook:", error);
      return res.status(400).json({
        success: false,
        error: "Webhook error"
      });
    }
  },

  // Reembolsar un pago
  async refundPayment(req: Request, res: Response) {
    try {
      const { paymentIntentId, amount } = req.body;

      if (!paymentIntentId) {
        return res.status(400).json({
          success: false,
          error: "paymentIntentId es requerido"
        });
      }

      const result = await PaymentService.refundPayment(
        paymentIntentId,
        amount ? parseFloat(amount) : undefined
      );

      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: result.error
        });
      }

      return res.status(200).json({
        success: true,
        data: result.refund
      });
    } catch (error) {
      console.error("Error in refundPayment:", error);
      return res.status(500).json({
        success: false,
        error: "Error interno del servidor"
      });
    }
  },

  // Obtener pagos de una orden
  async getOrderPayments(req: Request, res: Response) {
    try {
      const { orderId } = req.params;

      if (!orderId) {
        return res.status(400).json({
          success: false,
          error: "orderId es requerido"
        });
      }

      const result = await PaymentService.getOrderPayments(orderId);

      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: result.error
        });
      }

      return res.status(200).json({
        success: true,
        data: result.payments
      });
    } catch (error) {
      console.error("Error in getOrderPayments:", error);
      return res.status(500).json({
        success: false,
        error: "Error interno del servidor"
      });
    }
  },

  // Obtener un pago específico
  async getPayment(req: Request, res: Response) {
    try {
      const { paymentId } = req.params;

      if (!paymentId) {
        return res.status(400).json({
          success: false,
          error: "paymentId es requerido"
        });
      }

      const result = await PaymentService.getPayment(paymentId);

      if (!result.success) {
        return res.status(404).json({
          success: false,
          error: result.error
        });
      }

      return res.status(200).json({
        success: true,
        data: result.payment
      });
    } catch (error) {
      console.error("Error in getPayment:", error);
      return res.status(500).json({
        success: false,
        error: "Error interno del servidor"
      });
    }
  },

  // Listar todos los pagos (admin)
  async listPayments(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await PaymentService.listPayments(page, limit);

      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: result.error
        });
      }

      return res.status(200).json({
        success: true,
        data: result.payments,
        pagination: result.pagination
      });
    } catch (error) {
      console.error("Error in listPayments:", error);
      return res.status(500).json({
        success: false,
        error: "Error interno del servidor"
      });
    }
  }
}; 