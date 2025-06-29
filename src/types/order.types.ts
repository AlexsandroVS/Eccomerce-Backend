export type OrderItemInput = {
  product_id?: string;
  variant_id?: string;
  template_id?: string;
  quantity: number;
};

export type OrderCreateData = {
  user_id: string; 
  items: OrderItemInput[];
  shipping_address: Record<string, any>;
  billing_address: Record<string, any>;
  notes?: string;
};

export type OrderResponse = {
  id: string;
  status: string;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  tracking_number?: string;
  delivery_date?: string;
  created_at: string;
  items: {
    product_id?: string;
    variant_id?: string;
    template_id?: string;
    quantity: number;
    unit_price: number;
    total_price: number;
  }[];
  payments: {
    amount: number;
    gateway: string;
    status: string;
  }[];
};
