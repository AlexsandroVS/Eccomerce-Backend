import prisma from '../config/db.config';
import { InventoryLogCreateData, InventoryLogFilter } from '../types/inventoryLog.types';

export const InventoryLogService = {
  async create(data: InventoryLogCreateData) {
    if (!data.product_id || !data.quantity || !data.movement) {
      throw new Error('Datos incompletos');
    }

    return await prisma.inventoryLog.create({
      data: {
        product_id: data.product_id,
        variant_id: data.variant_id,
        quantity: data.quantity,
        movement: data.movement,
        reason: data.reason,
        reference_id: data.reference_id
      }
    });
  },

  async findAll(filter: InventoryLogFilter = {}) {
    return await prisma.inventoryLog.findMany({
      where: {
        product_id: filter.product_id,
        variant_id: filter.variant_id
      },
      orderBy: { created_at: 'desc' }
    });
  },

  async adjustStock(data: InventoryLogCreateData) {
    if (!['in', 'out', 'adjustment'].includes(data.movement)) {
      throw new Error('Tipo de movimiento inválido');
    }

    // Actualiza stock real
    if (data.variant_id) {
      await prisma.productVariant.update({
        where: { id: data.variant_id },
        data: {
          stock: { increment: data.quantity }
        }
      });
    }

    return await this.create(data);
  }
};
