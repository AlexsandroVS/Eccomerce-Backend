export type ProductVariantCreateData = {
  product_id: string;
  sku_suffix: string;
  stock: number;
  price: number;
  min_stock?: number;
  is_active?: boolean;
  attributes?: Record<string, string>; // color, tamaño, etc.
};

export type ProductVariantUpdateData = {
  sku_suffix?: string;
  stock?: number;
  price?: number;
  min_stock?: number;
  is_active?: boolean;
  attributes?: Record<string, string>;
};
