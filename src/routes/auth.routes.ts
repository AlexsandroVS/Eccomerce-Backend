import { Router, RequestHandler } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Rutas de autenticación
const registerHandler: RequestHandler = (req, res) => { AuthController.register(req, res); };
const loginHandler: RequestHandler = (req, res) => { AuthController.login(req, res); };
const logoutHandler: RequestHandler = (req, res) => { AuthController.logout(req, res); };
const profileHandler: RequestHandler = (req, res) => { AuthController.profile(req, res); };

router.post('/register', registerHandler);
router.post('/login', loginHandler);
router.post('/logout', logoutHandler);
router.get('/profile', authMiddleware, profileHandler);

export default router;
