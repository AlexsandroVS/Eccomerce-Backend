import { MongoClient, Db } from 'mongodb';

// Configuración optimizada para MongoDB Atlas con SSL
let client: MongoClient | null = null;
let db: Db | null = null;

const connectMongoDB = async (retries = 5, delay = 5000): Promise<void> => {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGODB_URL;
  
  if (!mongoUri) {
    throw new Error('MONGODB_URI is not defined');
  }

  // Configuración de opciones para Atlas con SSL corregido
  const options = {
    // Configuración de pool de conexiones
    maxPoolSize: 10,
    minPoolSize: 5,
    maxIdleTimeMS: 30000,
    
    // Configuración de timeout
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000,
    
    // Configuración SSL/TLS mínima
    tls: true,
    
    // Configuración adicional para Atlas
    retryWrites: true,
    w: 'majority' as const,
  };

  for (let i = 0; i < retries; i++) {
    try {
      client = new MongoClient(mongoUri, options);
      await client.connect();
      
      // Verificar que la conexión funciona
      await client.db().admin().ping();
      
      // Especificar la base de datos
      db = client.db('ecommerce-logs');
      
      console.log('✅ MongoDB Atlas connected');
      
      // Log información de la conexión (solo en desarrollo)
      if (process.env.NODE_ENV === 'development') {
        const dbName = db.databaseName;
        console.log(`📊 Database: ${dbName} on MongoDB Atlas`);
      }
      
      return;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`❌ MongoDB connection attempt ${i + 1}/${retries} failed:`, errorMessage);
      
      // Si es error SSL, continuar en desarrollo
      if (errorMessage.includes('SSL') || errorMessage.includes('TLS')) {
        console.log('🔧 SSL/TLS error detected');
        
        // En desarrollo, permitir continuar sin MongoDB
        if (process.env.NODE_ENV === 'development' && i === retries - 1) {
          console.log('⚠️  Skipping MongoDB in development due to SSL issues');
          return;
        }
      }
      
      if (i === retries - 1) {
        console.error('💥 All MongoDB connection attempts failed');
        
        // En desarrollo, no fallar por MongoDB
        if (process.env.NODE_ENV === 'development') {
          console.log('⚠️  Continuing without MongoDB in development');
          return;
        }
        
        throw error;
      }
      
      console.log(`⏳ Retrying in ${delay/1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

// Función para cerrar la conexión
const closeMongoDB = async (): Promise<void> => {
  try {
    if (client) {
      await client.close();
      client = null;
      db = null;
    console.log('✅ MongoDB disconnected');
    }
  } catch (error) {
    console.error('❌ Error disconnecting from MongoDB:', error);
  }
};

// Función para verificar el estado de la conexión
const checkMongoHealth = async (): Promise<boolean> => {
  try {
    if (!client || !db) {
      return false;
    }
    
    await db.admin().ping();
    return true;
  } catch (error) {
    return false; // No log error, solo retornar false
  }
};

// Función para obtener información de la base de datos
const getMongoInfo = async () => {
  try {
    if (!client || !db) {
      return null;
    }
    
    const admin = db.admin();
    const buildInfo = await admin.buildInfo();
    
    return {
      version: buildInfo.version,
      database: db.databaseName,
      host: 'MongoDB Atlas',
      port: 27017,
      connected: true
    };
  } catch (error) {
    return null;
  }
};

// Función para obtener la instancia de la base de datos
const getMongoDB = (): Db | null => {
  return db;
};

// Función para obtener el cliente
const getMongoClient = (): MongoClient | null => {
  return client;
};

// Función para obtener estadísticas de la base de datos
const getMongoStats = async () => {
  try {
    if (!client || !db) {
      return null;
    }
    
    const stats = await db.stats();
    const collections = await db.listCollections().toArray();
    
    return {
      collections: collections.length,
      dataSize: Math.round((stats.dataSize || 0) / 1024 / 1024), // Convert to MB
      storageSize: Math.round((stats.storageSize || 0) / 1024 / 1024), // Convert to MB
      indexes: stats.indexes || 0,
      objects: stats.objects || 0
    };
  } catch (error) {
    return {
      collections: 0,
      dataSize: 0,
      storageSize: 0,
      indexes: 0,
      objects: 0
    };
  }
};

// Manejo graceful del cierre
process.on('SIGINT', async () => {
  await closeMongoDB();
});

export { 
  connectMongoDB, 
  closeMongoDB, 
  checkMongoHealth, 
  getMongoInfo,
  getMongoDB,
  getMongoClient,
  getMongoStats
};

export default { 
  connectMongoDB, 
  closeMongoDB, 
  checkMongoHealth, 
  getMongoInfo, 
  getMongoDB, 
  getMongoClient, 
  getMongoStats 
};