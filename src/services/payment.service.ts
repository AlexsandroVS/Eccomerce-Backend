import prisma from "../config/db.config";
import { createPaymentIntent, getPaymentIntent, refundPayment } from "../config/stripe.config";

export const PaymentService = {
  // Crear un PaymentIntent de Stripe y registrar en la base de datos
  async createPayment(params: {
    orderId: string;
    amount: number;
    currency: string;
    customerEmail?: string;
    metadata?: Record<string, string>;
  }) {
    try {
      // Verificar que la orden existe
      const order = await prisma.order.findUnique({
        where: { id: params.orderId },
        include: { user: true }
      });

      if (!order) {
        throw new Error("Orden no encontrada");
      }

      // Crear PaymentIntent en Stripe
      const stripeResult = await createPaymentIntent({
        amount: params.amount,
        currency: params.currency,
        orderId: params.orderId,
        customerEmail: params.customerEmail || order.user.email,
        metadata: params.metadata
      });

      if (!stripeResult.success) {
        throw new Error(stripeResult.error);
      }

      // Registrar el pago en la base de datos
      const payment = await prisma.payment.create({
        data: {
          order_id: params.orderId,
          gateway: "stripe",
          gateway_id: stripeResult.paymentIntentId!,
          amount: params.amount,
          currency: params.currency,
          status: "pending",
          metadata: {
            client_secret: stripeResult.clientSecret,
            ...params.metadata
          }
        }
      });

      return {
        success: true,
        payment,
        clientSecret: stripeResult.clientSecret,
        paymentIntentId: stripeResult.paymentIntentId
      };
    } catch (error) {
      console.error("Error creating payment:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido"
      };
    }
  },

  // Confirmar un pago (llamado desde webhook de Stripe)
  async confirmPayment(paymentIntentId: string) {
    try {
      // Obtener información actualizada de Stripe
      const stripeResult = await getPaymentIntent(paymentIntentId);
      
      if (!stripeResult.success || !stripeResult.paymentIntent) {
        throw new Error(stripeResult.error || "PaymentIntent not found");
      }

      const paymentIntent = stripeResult.paymentIntent;

      // Actualizar el pago en la base de datos
      const payment = await prisma.payment.updateMany({
        where: { gateway_id: paymentIntentId },
        data: {
          status: paymentIntent.status,
          metadata: {
            order_id: paymentIntent.metadata.order_id,
            last_payment_error: paymentIntent.last_payment_error ? {
              code: paymentIntent.last_payment_error.code,
              message: paymentIntent.last_payment_error.message,
              type: paymentIntent.last_payment_error.type
            } : null,
            charges: Array.isArray((paymentIntent as any).charges?.data)
              ? (paymentIntent as any).charges.data.map((charge: any) => ({
                  id: charge.id,
                  amount: charge.amount,
                  status: charge.status
                }))
              : []
          },
          updated_at: new Date()
        }
      });

      // Si el pago fue exitoso, actualizar el estado de la orden
      if (paymentIntent.status === "succeeded") {
        await prisma.order.updateMany({
          where: { 
            id: paymentIntent.metadata.order_id 
          },
          data: { 
            status: "PROCESSING",
            updated_at: new Date()
          }
        });
      }

      return {
        success: true,
        payment,
        status: paymentIntent.status
      };
    } catch (error) {
      console.error("Error confirming payment:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido"
      };
    }
  },

  // Reembolsar un pago
  async refundPayment(paymentIntentId: string, amount?: number) {
    try {
      // Buscar el pago en la base de datos
      const payment = await prisma.payment.findFirst({
        where: { gateway_id: paymentIntentId }
      });

      if (!payment) {
        throw new Error("Pago no encontrado");
      }

      // Procesar reembolso en Stripe
      const stripeResult = await refundPayment(paymentIntentId, amount);

      if (!stripeResult.success || !stripeResult.refund) {
        throw new Error(stripeResult.error || "Refund failed");
      }

      // Actualizar el pago en la base de datos
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "refunded",
          metadata: {
            ...(typeof payment.metadata === 'object' && payment.metadata !== null ? payment.metadata : {}),
            refund: {
              id: stripeResult.refund.id,
              amount: stripeResult.refund.amount,
              status: stripeResult.refund.status
            }
          },
          updated_at: new Date()
        }
      });

      // Actualizar el estado de la orden
      await prisma.order.update({
        where: { id: payment.order_id },
        data: { 
          status: "CANCELLED",
          updated_at: new Date()
        }
      });

      return {
        success: true,
        refund: stripeResult.refund
      };
    } catch (error) {
      console.error("Error refunding payment:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido"
      };
    }
  },

  // Obtener pagos de una orden
  async getOrderPayments(orderId: string) {
    try {
      const payments = await prisma.payment.findMany({
        where: { order_id: orderId },
        orderBy: { created_at: "desc" }
      });

      return {
        success: true,
        payments
      };
    } catch (error) {
      console.error("Error getting order payments:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido"
      };
    }
  },

  // Obtener un pago específico
  async getPayment(paymentId: string) {
    try {
      const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
        include: { order: true }
      });

      if (!payment) {
        throw new Error("Pago no encontrado");
      }

      return {
        success: true,
        payment
      };
    } catch (error) {
      console.error("Error getting payment:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido"
      };
    }
  },

  // Listar todos los pagos (admin)
  async listPayments(page: number = 1, limit: number = 20) {
    try {
      const skip = (page - 1) * limit;

      const [payments, total] = await Promise.all([
        prisma.payment.findMany({
          include: { order: true },
          orderBy: { created_at: "desc" },
          skip,
          take: limit
        }),
        prisma.payment.count()
      ]);

      return {
        success: true,
        payments,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error("Error listing payments:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido"
      };
    }
  }
}; 