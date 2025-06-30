import 'dotenv/config';
import { connectDB, disconnectDB, checkDBHealth, getDBInfo } from './db.config';
import { connectMongoDB, closeMongoDB, checkMongoHealth, getMongoStats } from './mongo.config';
import redis, { testRedisConnection, closeRedisConnection } from './redis.config';

interface TestResult {
  service: string;
  status: 'success' | 'error';
  message: string;
  details?: any;
  duration?: number;
}

const testResults: TestResult[] = [];

const addResult = (service: string, status: 'success' | 'error', message: string, details?: any, duration?: number) => {
  testResults.push({ service, status, message, details, duration });
};

const printResults = () => {
  console.log('\n' + '='.repeat(60));
  console.log('🧪 CONNECTION TEST RESULTS');
  console.log('='.repeat(60));
  
  testResults.forEach(result => {
    const icon = result.status === 'success' ? '✅' : '❌';
    const duration = result.duration ? ` (${result.duration}ms)` : '';
    console.log(`${icon} ${result.service}: ${result.message}${duration}`);
    
    if (result.details && result.status === 'success') {
      Object.entries(result.details).forEach(([key, value]) => {
        console.log(`   ${key}: ${value}`);
      });
    }
    
    if (result.status === 'error' && result.details) {
      console.log(`   Error: ${result.details}`);
    }
  });
  
  const successCount = testResults.filter(r => r.status === 'success').length;
  const totalCount = testResults.length;
  
  console.log('\n' + '-'.repeat(60));
  console.log(`📊 Summary: ${successCount}/${totalCount} services connected successfully`);
  
  if (successCount === totalCount) {
    console.log('🎉 All services are ready for deployment!');
  } else {
    console.log('⚠️  Some services failed. Please check the configuration.');
  }
  console.log('='.repeat(60) + '\n');
};

const testPostgreSQL = async (): Promise<void> => {
  console.log('🔍 Testing PostgreSQL connection...');
  const start = Date.now();
  
  try {
    await connectDB();
    const duration = Date.now() - start;
    
    // Test de salud
    const healthOk = await checkDBHealth();
    if (!healthOk) {
      throw new Error('Health check failed');
    }
    
    // Obtener información de la base de datos
    const dbInfo = await getDBInfo();
    
    addResult('PostgreSQL (Render)', 'success', 'Connected successfully', {
      'Database': dbInfo?.database || 'Unknown',
      'User': dbInfo?.user || 'Unknown',
      'Host': dbInfo?.host || 'Unknown',
      'Version': dbInfo?.version?.split(' ')[0] || 'Unknown'
    }, duration);
    
  } catch (error) {
    const duration = Date.now() - start;
    addResult('PostgreSQL (Render)', 'error', 'Connection failed', 
      error instanceof Error ? error.message : String(error), duration);
  }
};

const testMongoDB = async (): Promise<void> => {
  console.log('🔍 Testing MongoDB connection...');
  const start = Date.now();
  
  try {
    await connectMongoDB();
    const duration = Date.now() - start;
    
    // Test de salud
    const healthOk = await checkMongoHealth();
    if (!healthOk) {
      throw new Error('Health check failed');
    }
    
    // Obtener estadísticas
    const stats = await getMongoStats();
    
    addResult('MongoDB (Atlas)', 'success', 'Connected successfully', {
      'Database': 'Connected',
      'Collections': stats?.collections || 0,
      'Data Size': stats?.dataSize ? `${stats.dataSize} MB` : 'N/A',
      'Storage Size': stats?.storageSize ? `${stats.storageSize} MB` : 'N/A'
    }, duration);
    
  } catch (error) {
    const duration = Date.now() - start;
    addResult('MongoDB (Atlas)', 'error', 'Connection failed', 
      error instanceof Error ? error.message : String(error), duration);
  }
};

const testRedis = async (): Promise<void> => {
  console.log('🔍 Testing Redis connection...');
  const start = Date.now();
  
  try {
    // Test básico de conexión
    const connected = await testRedisConnection();
    if (!connected) {
      throw new Error('Ping test failed');
    }
    
    const duration = Date.now() - start;
    
    // Test de escritura/lectura
    const testKey = 'test_connection_key';
    const testValue = 'test_value_' + Date.now();
    
    await redis.set(testKey, testValue, 'EX', 10); // Expira en 10 segundos
    const retrievedValue = await redis.get(testKey);
    
    if (retrievedValue !== testValue) {
      throw new Error('Read/Write test failed');
    }
    
    // Limpiar clave de test
    await redis.del(testKey);
    
    // Obtener información del servidor
    const info = await redis.info('server');
    const redisVersion = info.match(/redis_version:([^\r\n]+)/)?.[1] || 'Unknown';
    
    addResult('Redis (Upstash)', 'success', 'Connected successfully', {
      'Provider': 'Upstash',
      'Version': redisVersion,
      'Read/Write': 'OK',
      'SSL/TLS': 'Enabled'
    }, duration);
    
  } catch (error) {
    const duration = Date.now() - start;
    addResult('Redis (Upstash)', 'error', 'Connection failed', 
      error instanceof Error ? error.message : String(error), duration);
  }
};

const testEnvironmentVariables = (): void => {
  console.log('🔍 Testing environment variables...');
  
  const requiredVars = [
    'DATABASE_URL',
    'MONGODB_URI',
    'REDIS_URL',
    'JWT_SECRET'
  ];
  
  const missingVars: string[] = [];
  const presentVars: string[] = [];
  
  requiredVars.forEach(varName => {
    if (process.env[varName]) {
      presentVars.push(varName);
    } else {
      missingVars.push(varName);
    }
  });
  
  if (missingVars.length === 0) {
    addResult('Environment Variables', 'success', 'All required variables present', {
      'Variables': presentVars.join(', '),
      'Count': `${presentVars.length}/${requiredVars.length}`
    });
  } else {
    addResult('Environment Variables', 'error', 'Missing required variables', {
      'Missing': missingVars.join(', '),
      'Present': presentVars.join(', ')
    });
  }
};

const testAllConnections = async (): Promise<void> => {
  console.log('🚀 Starting comprehensive connection tests...\n');
  
  // Test variables de entorno primero
  testEnvironmentVariables();
  
  // Test conexiones de base de datos
  await testPostgreSQL();
  await testMongoDB();
  await testRedis();
  
  // Mostrar resultados
  printResults();
  
  // Cleanup
  try {
    await disconnectDB();
    await closeMongoDB();
    await closeRedisConnection();
    console.log('🧹 Cleanup completed');
  } catch (error) {
    console.error('⚠️  Error during cleanup:', error);
  }
  
  // Exit with appropriate code
  const hasErrors = testResults.some(r => r.status === 'error');
  process.exit(hasErrors ? 1 : 0);
};

// Manejo de errores no capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Ejecutar tests
testAllConnections();