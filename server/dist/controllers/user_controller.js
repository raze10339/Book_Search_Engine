import User from '../models/User.js';
import { getUserId } from '../services/auth.js';
import { getErrorMessage } from './helpers/index.js';
// Get all user's savedBooks (Returns an empty array if there is no client cookie)
// The user_id is attached by the blockGuest middleware function in services/auth.ts
export const getUserBooks = async (req, res) => {
    const user_id = getUserId(req);
    // If the client didn't send a cookie, we just send back an empty array
    if (!user_id) {
        return res.json([]);
    }
    const user = await User.findById(user_id);
    // Return just the user's books array, not the user object
    return res.json(user?.savedBooks);
};
// Save a book to a user's `savedBooks` field by adding it to the set (to prevent duplicates)
// The user_id is attached by the blockGuest middleware function in services/auth.ts
export const saveBook = async (req, res) => {
    try {
        await User.findOneAndUpdate({ _id: req.user_id }, { $addToSet: { savedBooks: req.body } }, { new: true, runValidators: true });
        // Return generic response - This is NOT used on the client-side, but we must return a response
        return res.json({
            message: 'Book saved successfully!'
        });
    }
    catch (error) {
        console.log('SAVE BOOK ERROR', error);
        const errorMessage = getErrorMessage(error);
        return res.status(400).json({
            message: errorMessage
        });
    }
};
// Remove a book from a user's `savedBooks`
// The user_id is attached by the blockGuest middleware function in services/auth.ts
export const deleteBook = async (req, res) => {
    const updatedUser = await User.findOneAndUpdate({ _id: req.user_id }, { $pull: { savedBooks: { googleBookId: req.params.bookId } } }, { new: true });
    if (!updatedUser) {
        return res.status(404).json({ message: "Couldn't find user with this id!" });
    }
    // Return generic response - This is NOT used on the client-side, but we must return a response
    return res.json({
        message: 'Book deleted successfully!'
    });
};
