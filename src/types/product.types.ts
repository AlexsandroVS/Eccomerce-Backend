export type ProductCreateData = {
  name: string;
  sku: string;
  slug?: string;
  description?: string;
  type?: 'SIMPLE' | 'VARIABLE'; // default: SIMPLE
  base_price?: number;         // Solo para SIMPLE
  stock?: number;              // Solo para SIMPLE
  min_stock?: number;          // Solo para SIMPLE
  attributes: Record<string, string>; // Se normaliza por separado
  categories: number[];
};

export type ProductUpdateData = {
  name?: string;
  slug?: string;
  sku?: string;
  description?: string;
  type?: 'SIMPLE' | 'VARIABLE';
  base_price?: number;
  stock?: number;              // Solo para SIMPLE
  min_stock?: number;          // Solo para SIMPLE
  attributes?: Record<string, string>;
  categories?: number[];
};

export type ProductImageData = {
  productId: string;
  url: string;
  alt_text?: string;
  is_primary?: boolean;
};
