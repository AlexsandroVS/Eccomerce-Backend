import swaggerJSDoc from "swagger-jsdoc";

// Configuración de rutas para diferentes entornos
const apiPaths = process.env.NODE_ENV === 'production' 
  ? ['./dist/docs/swagger/*.js', './dist/**/*.js']
  : ['./src/docs/swagger/*.ts', './src/**/*.ts'];

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Ecomerce API",
      version: "1.0.0",
      description: "API REST completa para el sistema de e-commerce con gestión de productos, usuarios, órdenes, inventario y más.",
      contact: {
        name: "API Support",
        email: "support@ecomerce.com"
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT"
      }
    },
    servers: [
      {
        url: "http://localhost:3000/api",
        description: "Servidor de desarrollo local",
      },
      {
        url: "https://api.ecomerce.com",
        description: "Servidor de producción",
      }
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "token",
          description: "Token de autenticación almacenado en cookie"
        },
      },
      schemas: {
        Error: {
          type: "object",
          properties: {
            error: {
              type: "string",
              description: "Tipo de error"
            },
            message: {
              type: "string",
              description: "Mensaje descriptivo del error"
            },
            statusCode: {
              type: "integer",
              description: "Código de estado HTTP"
            }
          }
        },
        Pagination: {
          type: "object",
          properties: {
            page: {
              type: "integer",
              description: "Página actual"
            },
            limit: {
              type: "integer",
              description: "Límite de elementos por página"
            },
            total: {
              type: "integer",
              description: "Total de elementos"
            },
            pages: {
              type: "integer",
              description: "Total de páginas"
            }
          }
        }
      },
      responses: {
        UnauthorizedError: {
          description: "No autorizado - Token de autenticación requerido",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error"
              }
            }
          }
        },
        ForbiddenError: {
          description: "Prohibido - Permisos insuficientes",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error"
              }
            }
          }
        },
        NotFoundError: {
          description: "No encontrado - Recurso no existe",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error"
              }
            }
          }
        },
        ValidationError: {
          description: "Error de validación - Datos inválidos",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error"
              }
            }
          }
        }
      }
    },
    security: [{ cookieAuth: [] }],
    tags: [
      {
        name: "Autenticación",
        description: "Endpoints para registro, login y gestión de sesiones"
      },
      {
        name: "Productos",
        description: "Gestión de productos y sus variantes"
      },
      {
        name: "Categorías",
        description: "Gestión de categorías de productos"
      },
      {
        name: "Órdenes",
        description: "Gestión de órdenes y pedidos"
      },
      {
        name: "Lista de Deseos",
        description: "Gestión de la lista de deseos del usuario"
      },
      {
        name: "Reseñas de Productos",
        description: "Gestión de reseñas y calificaciones"
      },
      {
        name: "Plantillas de Diseño",
        description: "Gestión de plantillas de diseño para productos"
      },
      {
        name: "Registro de Inventario",
        description: "Gestión de movimientos y ajustes de inventario"
      },
      {
        name: "Health Check",
        description: "Verificación del estado de los servicios"
      }
    ]
  },
  apis: apiPaths
});
