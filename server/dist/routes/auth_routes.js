import express from 'express';
import { registerUser, loginUser, getUser } from '../controllers/auth_controller.js';
const router = express.Router();
// Registers a new user
router.post('/register', registerUser);
// Logs the user in
router.post('/login', loginUser);
// Returns the user object if the client has a valid cookie with JWT
router.get('/user', getUser);
export default router;
