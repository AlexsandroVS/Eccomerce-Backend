import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import path from "path";
import { connectDB, disconnectDB, checkDBHealth } from "./config/db.config";
import { connectMongoDB, closeMongoDB, checkMongoHealth, getMongoStats } from "./config/mongo.config";
import redis, { testRedisConnection, closeRedisConnection } from "./config/redis.config";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import globalErrorHandler from './middlewares/error.middleware';

// Importar rutas
import authRoutes from "./routes/auth.routes";
import productRoutes from "./routes/product.routes";
import categoryRoutes from "./routes/category.routes";
import productVariantRoutes from "./routes/productVariant.routes";
import inventoryLogRoutes from "./routes/inventoryLog.routes";
import designTemplateRoutes from "./routes/designTemplate.routes";
import orderRoutes from "./routes/order.routes";
import productReviewRoutes from "./routes/productReview.routes";
import wishlistRoutes from "./routes/wishlist.routes";
import { swaggerSpec } from "./docs/swagger";

const app: Express = express();

// Configuración CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Set-Cookie'],
  maxAge: 86400 // 24 horas
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Configuración de rutas estáticas para imágenes
app.use('/uploads', express.static(path.join(__dirname, '../uploads'), {
  setHeaders: (res, _path) => {
    res.set('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:5173');
    res.set('Access-Control-Allow-Credentials', 'true');
  }
}));

// Middleware para manejar errores de CORS
const corsErrorHandler = (err: any, _req: Request, res: Response, next: NextFunction) => {
  if (err.name === 'CORSError') {
    res.status(403).json({
      error: 'CORS not allowed',
      message: err.message
    });
    return;
  }
  next(err);
};

app.use(corsErrorHandler);

// Health check endpoint completo
app.get("/health", async (_req, res: Response) => {
  try {
    const startTime = Date.now();
    
    // Test Redis
    const redisStart = Date.now();
    const redisStatus = await testRedisConnection();
    const redisLatency = Date.now() - redisStart;
    
    // Test PostgreSQL
    const pgStart = Date.now();
    const dbStatus = await checkDBHealth();
    const pgLatency = Date.now() - pgStart;

    // Test MongoDB
    const mongoStart = Date.now();
    const mongoStatus = await checkMongoHealth();
    const mongoLatency = Date.now() - mongoStart;
    
    // Get additional stats
    const mongoStats = mongoStatus ? await getMongoStats() : null;

    const overallStatus = redisStatus && dbStatus && mongoStatus;
    const totalLatency = Date.now() - startTime;

    res.status(overallStatus ? 200 : 503).json({
      status: overallStatus ? "OK" : "DEGRADED",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      totalLatency: `${totalLatency}ms`,
      services: {
        redis: {
          status: redisStatus ? "healthy" : "unhealthy",
          provider: "upstash",
          latency: `${redisLatency}ms`
        },
        postgres: {
          status: dbStatus ? "healthy" : "unhealthy",
          provider: "render",
          latency: `${pgLatency}ms`
        },
        mongo: {
          status: mongoStatus ? "healthy" : "unhealthy",
          provider: "atlas",
          latency: `${mongoLatency}ms`,
          stats: mongoStats ? {
            collections: mongoStats.collections,
            dataSize: `${mongoStats.dataSize} MB`,
            storageSize: `${mongoStats.storageSize} MB`
          } : null
        }
      },
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        pid: process.pid,
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
        }
      }
    });
  } catch (error) {
    res.status(503).json({
      status: "ERROR",
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// Endpoint específico para probar Redis
app.get("/health/redis", async (_req, res: Response) => {
  try {
    const start = Date.now();
    await redis.set('health_check', 'ok', 'EX', 10); // Expira en 10 segundos
    const value = await redis.get('health_check');
    const latency = Date.now() - start;
    
    res.json({
      status: "OK",
      latency: `${latency}ms`,
      test: value === 'ok' ? 'passed' : 'failed',
      provider: "upstash",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      status: "ERROR",
      error: error instanceof Error ? error.message : "Unknown error",
      provider: "upstash",
      timestamp: new Date().toISOString()
    });
  }
});

// Endpoint específico para MongoDB
app.get("/health/mongo", async (_req, res: Response) => {
  try {
    const start = Date.now();
    const status = await checkMongoHealth();
    const stats = status ? await getMongoStats() : null;
    const latency = Date.now() - start;
    
    res.json({
      status: status ? "OK" : "ERROR",
      latency: `${latency}ms`,
      provider: "atlas",
      stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      status: "ERROR",
      error: error instanceof Error ? error.message : "Unknown error",
      provider: "atlas",
      timestamp: new Date().toISOString()
    });
  }
});

// Rutas principales
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/product-variants", productVariantRoutes);
app.use("/api/inventory-logs", inventoryLogRoutes);
app.use("/api/design-templates", designTemplateRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/product-reviews", productReviewRoutes);
app.use("/api/wishlist", wishlistRoutes);

// Documentación API
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware de manejo de errores (debe ir después de todas las rutas)
app.use(globalErrorHandler);

// Inicialización
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    console.log('🚀 Starting e-commerce server...');
    console.log(`📋 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔧 Node.js version: ${process.version}`);
    
    // Conectar a las bases de datos con timeouts
    console.log('📊 Connecting to databases...');
    
    const connectionPromises = [
      connectDB().then(() => console.log('✅ PostgreSQL (Render) connected')),
      connectMongoDB().then(() => console.log('✅ MongoDB (Atlas) connected')),
      testRedisConnection().then(success => {
        if (success) {
          console.log('✅ Redis (Upstash) connected');
        } else {
          throw new Error('Redis connection failed');
        }
      })
    ];
    
    // Esperar a que todas las conexiones se establezcan (máximo 30 segundos)
    await Promise.race([
      Promise.all(connectionPromises),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database connections timeout')), 30000)
      )
    ]);
    
    app.listen(PORT, () => {
      console.log('\n🎉 Server started successfully!');
      console.log(`🌐 Server running on port ${PORT}`);
      console.log('📊 Connected services:');
      console.log('  • PostgreSQL (Render) - Main database');
      console.log('  • MongoDB (Atlas) - Logging & analytics');
      console.log('  • Redis (Upstash) - Cache & sessions');
      console.log('\n📖 Available endpoints:');
      console.log(`  • API Documentation: http://localhost:${PORT}/api-docs`);
      console.log(`  • Health Check: http://localhost:${PORT}/health`);
      console.log(`  • Redis Health: http://localhost:${PORT}/health/redis`);
      console.log(`  • MongoDB Health: http://localhost:${PORT}/health/mongo`);
      console.log('\n🚀 Ready for requests!');
    });
    
  } catch (error) {
    console.error('\n❌ Error starting server:');
    console.error(error instanceof Error ? error.message : error);
    console.error('\n🔧 Troubleshooting tips:');
    console.error('  1. Check your .env file has all required variables');
    console.error('  2. Verify database connections with: npm run test:connections');
    console.error('  3. Ensure all services are running and accessible');
    process.exit(1);
  }
};

// Manejo de cierre graceful
const gracefulShutdown = async (signal: string) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  
  const shutdownPromises = [
    disconnectDB().then(() => console.log('✅ PostgreSQL disconnected')),
    closeMongoDB().then(() => console.log('✅ MongoDB disconnected')),
    closeRedisConnection().then(() => console.log('✅ Redis disconnected'))
  ];
  
  try {
    await Promise.all(shutdownPromises);
    console.log('👋 Server closed gracefully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during graceful shutdown:', error);
    process.exit(1);
  }
};

// Manejo de señales del sistema
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Manejo de errores no capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

startServer();

export default app;