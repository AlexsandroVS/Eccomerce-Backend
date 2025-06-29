import { PrismaClient } from '@prisma/client';

// Configuración optimizada para producción en la nube
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'info', 'warn', 'error'] 
    : ['warn', 'error'], // Menos logs en producción
  
  // Configuración de conexión para la nube
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  
  // Configuración de transacciones y timeouts
  transactionOptions: {
    maxWait: 5000, // máximo tiempo de espera para adquirir una transacción en ms
    timeout: 10000, // máximo tiempo de ejecución de transacción en ms
  },
});

// Función para conectar con reintentos
export const connectDB = async (retries = 5, delay = 5000): Promise<void> => {
  for (let i = 0; i < retries; i++) {
    try {
      await prisma.$connect();
      
      // Verificar que la conexión funciona
      await prisma.$queryRaw`SELECT 1`;
      
      console.log('✅ PostgreSQL connected via Prisma (Render)');
      return;
    } catch (error) {
      console.error(`❌ PostgreSQL connection attempt ${i + 1}/${retries} failed:`, 
        error instanceof Error ? error.message : error
      );
      
      if (i === retries - 1) {
        console.error('💥 All PostgreSQL connection attempts failed');
        throw error;
      }
      
      console.log(`⏳ Retrying in ${delay/1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

// Función para desconectar limpiamente
export const disconnectDB = async (): Promise<void> => {
  try {
    await prisma.$disconnect();
    console.log('✅ PostgreSQL disconnected');
  } catch (error) {
    console.error('❌ Error disconnecting from PostgreSQL:', error);
  }
};

// Función para verificar el estado de la conexión
export const checkDBHealth = async (): Promise<boolean> => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('❌ Database health check failed:', error);
    return false;
  }
};

// Función para obtener información de la base de datos
export const getDBInfo = async () => {
  try {
    const result = await prisma.$queryRaw`
      SELECT 
        version() as version,
        current_database() as database,
        current_user as user,
        inet_server_addr() as host,
        inet_server_port() as port
    ` as any[];
    
    return result[0];
  } catch (error) {
    console.error('❌ Failed to get database info:', error);
    return null;
  }
};

// Middleware para manejo de errores de conexión
prisma.$use(async (params, next) => {
  const start = Date.now();
  
  try {
    const result = await next(params);
    const duration = Date.now() - start;
    
    // Log solo queries lentas en producción
    if (process.env.NODE_ENV === 'production' && duration > 1000) {
      console.log(`🐌 Slow query detected: ${params.model}.${params.action} took ${duration}ms`);
    }
    
    return result;
  } catch (error) {
    const duration = Date.now() - start;
    console.error(`❌ Database operation failed after ${duration}ms:`, {
      model: params.model,
      action: params.action,
      error: error instanceof Error ? error.message : error
    });
    throw error;
  }
});

export default prisma;