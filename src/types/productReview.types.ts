export type ProductReviewCreateData = {
  product_id: string;
  rating: number; // 1 a 5
  comment?: string;
};

export type ProductReviewResponse = {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment?: string;
  created_at: Date;
};
