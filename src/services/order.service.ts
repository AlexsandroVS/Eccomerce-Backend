import prisma from '../config/db.config';
import { OrderCreateData } from '../types/order.types';
import { v4 as uuidv4 } from 'uuid';

export const OrderService = {
  async create(data: OrderCreateData) {
    const orderId = uuidv4();

    let subtotal = 0;
    const itemsData = [];

    for (const item of data.items) {
      let unitPrice = 0;
      let refProductId = item.product_id ?? undefined;
      let refVariantId = item.variant_id ?? undefined;

      if (item.variant_id) {
        const variant = await prisma.productVariant.findUnique({
          where: { id: item.variant_id },
          include: { product: true }
        });
        if (!variant || !variant.is_active) throw new Error('Variante inválida');
        unitPrice = variant.price;
        refProductId = variant.product_id;

        // Restar stock
        await prisma.productVariant.update({
          where: { id: item.variant_id },
          data: { stock: { decrement: item.quantity } }
        });

        // Inventario
        await prisma.inventoryLog.create({
          data: {
            variant_id: item.variant_id,
            product_id: variant.product_id,
            quantity: -item.quantity,
            movement: 'sale',
            reason: 'Compra realizada',
            reference_id: orderId
          }
        });

      } else if (item.product_id) {
        const product = await prisma.product.findUnique({
          where: { id: item.product_id }
        });
        if (!product || !product.is_active || !product.base_price) {
          throw new Error('Producto inválido o sin precio base');
        }
        unitPrice = product.base_price;

        // No gestionamos stock aquí por ser producto simple sin variantes
        await prisma.inventoryLog.create({
          data: {
            product_id: product.id,
            quantity: -item.quantity,
            movement: 'sale',
            reason: 'Compra realizada',
            reference_id: orderId
          }
        });
      } else {
        throw new Error('Ítem inválido: se requiere product_id o variant_id');
      }

      const totalPrice = unitPrice * item.quantity;
      subtotal += totalPrice;

      itemsData.push({
        order_id: orderId,
        product_id: refProductId,
        variant_id: refVariantId,
        quantity: item.quantity,
        unit_price: unitPrice,
        total_price: totalPrice,
        discount_applied: 0
      });
    }

    const shipping = 0; // Lógica futura
    const discount = 0; // Lógica futura
    const tax = subtotal * 0.18;
    const total = subtotal + shipping + tax - discount;

    const order = await prisma.order.create({
      data: {
        id: orderId,
        user_id: data.user_id,
        status: 'PENDING',
        subtotal,
        shipping,
        discount,
        tax,
        total,
        shipping_address: data.shipping_address,
        billing_address: data.billing_address,
        notes: data.notes,
        items: { createMany: { data: itemsData } },
        payments: {
          create: {
            gateway: 'manual',
            amount: total,
            status: 'pending',
            metadata: {}
          }
        }
      },
      include: {
        items: true,
        payments: true
      }
    });

    return order;
  },

  async getById(id: string) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        payments: true
      }
    });

    if (!order) throw new Error('Orden no encontrada');
    return order;
  },

  async listByUser(userId: string) {
    return await prisma.order.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      include: { items: true, payments: true }
    });
  },

  async listAll() {
    return await prisma.order.findMany({
      orderBy: { created_at: 'desc' },
      include: { items: true, payments: true, user: true }
    });
  },

  async cancel(id: string) {
    const order = await prisma.order.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        updated_at: new Date()
      }
    });
    return order;
  }
};
