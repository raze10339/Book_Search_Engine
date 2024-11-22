import User from '../models/User';
// save a book to a user's `savedBooks` field by adding it to the set (to prevent duplicates)
// user comes from `req.user` created in the auth middleware function
export const saveBook = async (req, res) => {
    try {
        const updatedUser = await User.findOneAndUpdate({ _id: req.user_id }, { $addToSet: { savedBooks: req.body } }, { new: true, runValidators: true });
        return res.json(updatedUser);
    }
    catch (err) {
        console.log(err);
        return res.status(400).json(err);
    }
};
// remove a book from `savedBooks`
export const deleteBook = async (req, res) => {
    const updatedUser = await User.findOneAndUpdate({ _id: req.user_id }, { $pull: { savedBooks: { bookId: req.params.bookId } } }, { new: true });
    if (!updatedUser) {
        return res.status(404).json({ message: "Couldn't find user with this id!" });
    }
    return res.json(updatedUser);
};
