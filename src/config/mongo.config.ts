import { MongoClient, Db, ReadPreference } from 'mongodb';
import 'dotenv/config';

const uri = process.env.MONGODB_URI!;

if (!uri) {
  throw new Error('MONGODB_URI is not defined in environment variables');
}

let client: MongoClient | null = null;
let db: Db | null = null;

// Configuración optimizada para MongoDB Atlas
const mongoOptions = {
  // Configuración de pool de conexiones
  maxPoolSize: 10,        // Máximo 10 conexiones concurrentes
  minPoolSize: 2,         // Mínimo 2 conexiones
  maxIdleTimeMS: 30000,   // Cerrar conexiones después de 30s de inactividad
  
  // Configuración de timeouts
  serverSelectionTimeoutMS: 10000,  // 10s para seleccionar servidor
  socketTimeoutMS: 45000,           // 45s timeout de socket
  connectTimeoutMS: 10000,          // 10s para conectar
  
  // Configuración de retries
  retryWrites: true,                // Retry automático de escrituras
  retryReads: true,                 // Retry automático de lecturas
  
  // Configuración de compresión
  compressors: ['zlib' as const],   // Compresión para reducir transferencia
  
  // Configuración de read/write concerns
  writeConcern: {
    w: 'majority' as const,         // Esperar confirmación de mayoría
    j: true,                        // Esperar journal
    wtimeout: 10000                 // Timeout de 10s para write concern
  },
  readPreference: ReadPreference.PRIMARY,  // Leer desde primary por consistencia
  
  // Configuración para Atlas
  tls: true,                        // TLS habilitado (requerido por Atlas)
  tlsAllowInvalidCertificates: false,
  tlsAllowInvalidHostnames: false,
};

export const connectMongoDB = async (retries = 5, delay = 5000): Promise<Db> => {
  if (db && client) {
    return db; // Reutilizar conexión existente
  }

  for (let i = 0; i < retries; i++) {
    try {
      client = new MongoClient(uri, mongoOptions);
      await client.connect();
      
      // Verificar que la conexión funciona
      await client.db('admin').command({ ping: 1 });
      
      // Obtener referencia a la base de datos
      db = client.db('ecommerce-logs'); // Especifica tu database
      
      console.log('✅ MongoDB Atlas connected for logs');
      
      // En desarrollo, mostrar más información
      if (process.env.NODE_ENV === 'development') {
        const admin = client.db('admin');
        const buildInfo = await admin.command({ buildInfo: 1 });
        console.log(`📊 MongoDB ${buildInfo.version} - Database: ecommerce-logs`);
      }
      
      return db;
    } catch (error) {
      console.error(`❌ MongoDB connection attempt ${i + 1}/${retries} failed:`, 
        error instanceof Error ? error.message : error
      );
      
      if (i === retries - 1) {
        console.error('💥 All MongoDB connection attempts failed');
        throw error;
      }
      
      console.log(`⏳ Retrying MongoDB connection in ${delay/1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw new Error('Failed to connect to MongoDB after all retries');
};

export const getMongoDB = (): Db => {
  if (!db) {
    throw new Error('MongoDB not initialized. Call connectMongoDB() first.');
  }
  return db;
};

export const closeMongoDB = async (): Promise<void> => {
  try {
    if (client) {
      await client.close();
      console.log('✅ MongoDB disconnected');
    }
  } catch (error) {
    console.error('❌ Error disconnecting from MongoDB:', error);
  } finally {
    // Reset variables
    client = null;
    db = null;
  }
};

// Función para verificar el estado de la conexión
export const checkMongoHealth = async (): Promise<boolean> => {
  try {
    if (!db || !client) return false;
    
    await client.db('admin').command({ ping: 1 });
    return true;
  } catch (error) {
    console.error('❌ MongoDB health check failed:', error);
    return false;
  }
};

// Función para obtener estadísticas de la base de datos
export const getMongoStats = async () => {
  try {
    if (!db || !client) return null;
    
    const stats = await db.stats();
    const serverStatus = await client.db('admin').command({ serverStatus: 1 });
    
    return {
      database: db.databaseName,
      collections: stats.collections,
      dataSize: Math.round(stats.dataSize / 1024 / 1024 * 100) / 100, // MB
      storageSize: Math.round(stats.storageSize / 1024 / 1024 * 100) / 100, // MB
      indexes: stats.indexes,
      uptime: serverStatus.uptime,
      connections: serverStatus.connections
    };
  } catch (error) {
    console.error('❌ Failed to get MongoDB stats:', error);
    return null;
  }
};

// Función para crear índices iniciales (opcional)
export const createInitialIndexes = async (): Promise<void> => {
  try {
    const db = getMongoDB();
    
    // Ejemplo: crear índices para logs
    const logsCollection = db.collection('application_logs');
    
    await logsCollection.createIndexes([
      { key: { timestamp: -1 }, name: 'timestamp_desc' },
      { key: { level: 1 }, name: 'level_asc' },
      { key: { userId: 1 }, name: 'userId_asc', sparse: true },
      { key: { action: 1 }, name: 'action_asc', sparse: true },
    ]);
    
    console.log('✅ MongoDB indexes created');
  } catch (error) {
    console.error('❌ Error creating MongoDB indexes:', error);
  }
};

// Manejo de eventos de conexión
process.on('SIGINT', async () => {
  console.log('📝 Closing MongoDB connection...');
  await closeMongoDB();
});

process.on('SIGTERM', async () => {
  console.log('📝 Closing MongoDB connection...');
  await closeMongoDB();
});

export default { 
  connectMongoDB, 
  getMongoDB, 
  closeMongoDB, 
  checkMongoHealth, 
  getMongoStats,
  createInitialIndexes 
};