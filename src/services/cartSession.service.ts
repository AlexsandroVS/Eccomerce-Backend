import redis from '../config/redis.config';

const CART_KEY = (userId: string) => `user:${userId}:cart`;
const RECENT_VIEWS_KEY = (userId: string) => `user:${userId}:recent_views`;
const SESSION_KEY = (sessionId: string) => `session:${sessionId}`;

export const CartSessionService = {
  // ------------------ CART ------------------

  async setCart(userId: string, cartItems: any[], sessionId: string) {
    const data = JSON.stringify({ items: cartItems, updated_at: new Date(), session_id: sessionId });
    await redis.hset(CART_KEY(userId), 'data', data);
  },

  async getCart(userId: string) {
    const data = await redis.hget(CART_KEY(userId), 'data');
    return data ? JSON.parse(data) : null;
  },

  async clearCart(userId: string) {
    await redis.del(CART_KEY(userId));
  },

  // ------------------ RECENTLY VIEWED ------------------

  async addRecentView(userId: string, productId: string) {
    const key = RECENT_VIEWS_KEY(userId);
    await redis.lrem(key, 0, productId); // Evitar duplicados
    await redis.lpush(key, productId);
    await redis.ltrim(key, 0, 9); // Solo 10 productos recientes
  },

  async getRecentViews(userId: string) {
    return await redis.lrange(RECENT_VIEWS_KEY(userId), 0, 9);
  },

  // ------------------ SESSION ------------------

  async setSession(sessionId: string, data: any, expiresInSeconds = 3600) {
    await redis.set(SESSION_KEY(sessionId), JSON.stringify(data), 'EX', expiresInSeconds);
  },

  async getSession(sessionId: string) {
    const data = await redis.get(SESSION_KEY(sessionId));
    return data ? JSON.parse(data) : null;
  },

  async deleteSession(sessionId: string) {
    await redis.del(SESSION_KEY(sessionId));
  }
};
