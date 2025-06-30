import Stripe from 'stripe';

// Configuración de Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
  typescript: true,
});

// Configuración de webhooks
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Función para verificar la configuración
export const testStripeConnection = async (): Promise<boolean> => {
  try {
    // Intentar obtener información de la cuenta
    const account = await stripe.accounts.retrieve();
    console.log('✅ Stripe connected successfully');
    console.log(`📊 Account: ${account.business_profile?.name || 'Stripe Account'}`);
    return true;
  } catch (error) {
    console.error('❌ Stripe connection failed:', error);
    return false;
  }
};

// Función para crear un PaymentIntent
export const createPaymentIntent = async (params: {
  amount: number;
  currency: string;
  orderId: string;
  customerEmail?: string;
  metadata?: Record<string, string>;
}) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(params.amount * 100), // Stripe usa centavos
      currency: params.currency.toLowerCase(),
      metadata: {
        order_id: params.orderId,
        ...params.metadata,
      },
      receipt_email: params.customerEmail,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

// Función para verificar webhook
export const verifyWebhook = (payload: string, signature: string) => {
  try {
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET not configured');
    }

    const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    return { success: true, event };
  } catch (error) {
    console.error('Webhook verification failed:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Función para obtener información de un PaymentIntent
export const getPaymentIntent = async (paymentIntentId: string) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return { success: true, paymentIntent };
  } catch (error) {
    console.error('Error retrieving payment intent:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Función para reembolsar un pago
export const refundPayment = async (paymentIntentId: string, amount?: number) => {
  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount ? Math.round(amount * 100) : undefined,
    });

    return { success: true, refund };
  } catch (error) {
    console.error('Error creating refund:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Función para crear un cliente
export const createCustomer = async (params: {
  email: string;
  name?: string;
  phone?: string;
  metadata?: Record<string, string>;
}) => {
  try {
    const customer = await stripe.customers.create({
      email: params.email,
      name: params.name,
      phone: params.phone,
      metadata: params.metadata,
    });

    return { success: true, customer };
  } catch (error) {
    console.error('Error creating customer:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export default stripe; 