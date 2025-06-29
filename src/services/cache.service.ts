import redis from '../config/redis.config';

export const setCart = async (userId: string, cartData: any) => {
  await redis.hset(`user:${userId}:cart`, {
    items: JSON.stringify(cartData.items),
    updated_at: new Date().toISOString(),
    session_id: cartData.session_id || ''
  });
};

export const getCart = async (userId: string) => {
  const result = await redis.hgetall(`user:${userId}:cart`);
  if (!result.items) return null;
  return {
    items: JSON.parse(result.items),
    updated_at: result.updated_at,
    session_id: result.session_id
  };
};

export const cacheFullProduct = async (productId: string, data: any) => {
  await redis.set(`product:${productId}:full`, JSON.stringify(data), 'EX', 3600);
};

export const getFullProductFromCache = async (productId: string) => {
  const data = await redis.get(`product:${productId}:full`);
  return data ? JSON.parse(data) : null;
};

export const addRecentView = async (userId: string, productId: string) => {
  const key = `user:${userId}:recent_views`;
  await redis.lrem(key, 0, productId);
  await redis.lpush(key, productId);
  await redis.ltrim(key, 0, 9);
};

export const getRecentViews = async (userId: string) => {
  return await redis.lrange(`user:${userId}:recent_views`, 0, 9);
};
