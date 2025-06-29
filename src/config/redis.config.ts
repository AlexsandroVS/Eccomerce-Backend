import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL!, {
  // Configuración específica para Upstash
  tls: {
    // Habilita TLS para conexiones seguras
    rejectUnauthorized: true,
  },
  // Configuración de reconexión
  maxRetriesPerRequest: 3,
  lazyConnect: true, // Conecta solo cuando sea necesario
  // Configuración de timeouts
  connectTimeout: 10000,
  commandTimeout: 5000,
  // Pool de conexiones
  family: 4, // Usar IPv4
  keepAlive: 30000, // Cambiar de boolean a number (milliseconds)
});

redis.on('connect', () => {
  console.log('🔴 Redis connected to Upstash');
});

redis.on('ready', () => {
  console.log('✅ Redis ready for commands');
});

redis.on('error', (err) => {
  console.error('❌ Redis connection error:', err.message);
});

redis.on('close', () => {
  console.log('🔴 Redis connection closed');
});

redis.on('reconnecting', () => {
  console.log('🔄 Redis reconnecting...');
});

// Función para verificar la conexión
export const testRedisConnection = async (): Promise<boolean> => {
  try {
    await redis.ping();
    console.log('✅ Redis ping successful');
    return true;
  } catch (error) {
    console.error('❌ Redis ping failed:', error);
    return false;
  }
};

// Función para cerrar la conexión limpiamente
export const closeRedisConnection = async (): Promise<void> => {
  try {
    await redis.quit();
    console.log('✅ Redis connection closed gracefully');
  } catch (error) {
    console.error('❌ Error closing Redis connection:', error);
  }
};

export default redis;