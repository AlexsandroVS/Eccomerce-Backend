export type InventoryMovement = 'in' | 'out' | 'adjustment' | 'sale' | 'return';

export type InventoryLogCreateData = {
  product_id: string;
  variant_id?: string;
  quantity: number;
  movement: InventoryMovement;
  reason?: string;
  reference_id?: string;
};

export type InventoryLogFilter = {
  product_id?: string;
  variant_id?: string;
};
