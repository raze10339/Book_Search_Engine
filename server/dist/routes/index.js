import express from 'express';
import auth_routes from './api/auth_routes.js';
import user_routes from './api/user_routes.js';
const router = express.Router();
router.use('/auth', auth_routes);
router.use('/api', user_routes);
export default router;
