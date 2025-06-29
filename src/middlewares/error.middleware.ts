import { ErrorRequestHandler } from 'express';

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error('Error:', err);

  const errorMessages: Record<string, { status: number; message: string }> = {
    'Invalid token': { status: 401, message: 'Token inválido o expirado' },
    'Token expired': { status: 401, message: 'Token inválido o expirado' },
    'User not found': { status: 401, message: 'Usuario no encontrado' },
    'Credenciales inválidas': { status: 401, message: 'Credenciales inválidas' }
  };

  const error = errorMessages[err.message] || {
    status: err.status || 500,
    message: err.message || 'Error interno del servidor'
  };

  res.status(error.status).json({ error: error.message });
};

export default errorHandler; 