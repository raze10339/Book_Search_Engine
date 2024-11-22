import express from 'express';
const router = express.Router();
router.route('/').post(createUser).put(authenticateToken, saveBook);
router.route('/books/:bookId').delete(authenticateToken, deleteBook);
export default router;
