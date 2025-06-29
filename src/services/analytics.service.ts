import { Db } from 'mongodb';
import { getMongoDB } from '../config/mongo.config';

const PRODUCT_COLLECTION = 'product_analytics';
const USER_COLLECTION = 'user_insights';
const TEMPLATE_COLLECTION = 'template_analytics';

// ---------- PRODUCT ANALYTICS ----------

export const updateProductAnalytics = async (productId: string, update: Partial<any>) => {
  const db: Db = getMongoDB();
  await db.collection(PRODUCT_COLLECTION).updateOne(
    { product_id: productId },
    { $set: { ...update, last_updated: new Date() } },
    { upsert: true }
  );
};

export const getProductAnalytics = async (productId: string) => {
  const db: Db = getMongoDB();
  return await db.collection(PRODUCT_COLLECTION).findOne({ product_id: productId });
};

// ---------- USER INSIGHTS ----------

export const updateUserInsights = async (userId: string, update: Partial<any>) => {
  const db: Db = getMongoDB();
  await db.collection(USER_COLLECTION).updateOne(
    { user_id: userId },
    { $set: update },
    { upsert: true }
  );
};

export const getUserInsights = async (userId: string) => {
  const db: Db = getMongoDB();
  return await db.collection(USER_COLLECTION).findOne({ user_id: userId });
};

// ---------- TEMPLATE ANALYTICS ----------

export const updateTemplateAnalytics = async (templateId: string, update: Partial<any>) => {
  const db: Db = getMongoDB();
  await db.collection(TEMPLATE_COLLECTION).updateOne(
    { template_id: templateId },
    { $set: { ...update, last_updated: new Date() } },
    { upsert: true }
  );
};

export const getTemplateAnalytics = async (templateId: string) => {
  const db: Db = getMongoDB();
  return await db.collection(TEMPLATE_COLLECTION).findOne({ template_id: templateId });
};