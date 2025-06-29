export type CategoryCreateData = {
  name: string;
  slug: string;
  parent_id?: number | null;
  attributes_normalized?: Record<string, any>;
};