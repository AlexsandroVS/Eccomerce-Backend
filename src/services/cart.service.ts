import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export const CartService = {
  getCart: async (userId: string) => {
    return redis.get(`cart:${userId}`);
  },
  
  updateCart: async (userId: string, cartData: any) => {
    return redis.setex(`cart:${userId}`, 172800, JSON.stringify(cartData)); // 48h TTL
  },
  
  deleteCart: async (userId: string) => {
    return redis.del(`cart:${userId}`);
  }
};