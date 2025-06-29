export type DesignTemplateProductInput = {
  product_id: string;
  quantity?: number;
  is_optional?: boolean;
  notes?: string;
};

export type DesignTemplateCreateData = {
  name: string;
  slug?: string;
  description?: string;
  room_type?: string;
  style?: string;
  discount?: number;
  cover_image_url?: string;
  featured?: boolean;
  products: DesignTemplateProductInput[];
};

export type DesignTemplateUpdateData = Partial<DesignTemplateCreateData>;

export type DesignTemplateResponse = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  room_type?: string;
  style?: string;
  total_price: number;
  discount?: number;
  featured: boolean;
  products: {
    product_id: string;
    quantity: number;
    is_optional: boolean;
    notes?: string;
  }[];
};
