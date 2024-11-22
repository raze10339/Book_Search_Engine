// import user model
import User from '../models/User.js';
// import sign token function from auth
import { signToken, getUserId } from '../services/auth.js';
import { getErrorMessage } from './helpers/index.js';
// Returns the logged in user object or returns a null user if no cookie is attached or the JTW is not valid
export const getUser = async (req, res) => {
    // Retrieves the user_id from the request object - Check out services/auth.ts->getUserId
    const user_id = getUserId(req);
    if (!user_id) {
        return res.json({
            user: null
        });
    }
    const user = await User.findById(user_id).select('_id username savedBooks');
    if (!user) {
        return res.json({
            user: null
        });
    }
    return res.json({
        user: user
    });
};
/*
  Registering a user by attempting to create a new user object in the database with their form
  credentials.
  If we are able to create their new user object, we send a cookie with a JWT attached and return their user object
  Related to SignupForm.tsx in client/src/components
*/
export const registerUser = async (req, res) => {
    console.log('Register request received:', req.body);
    try {
        const user = await User.create(req.body);
        console.log('User created successfully:', user);
        // Create a JWT token
        const token = signToken(user._id);
        // Send a cookie back with the JWT attached
        res.cookie('book_app_token', token, {
            httpOnly: true,
            secure: process.env.PORT ? true : false,
            sameSite: true
        });
        return res.json({ user });
    }
    catch (error) {
        console.error('Error in registerUser:', error.message);
        const errorMessage = getErrorMessage(error);
        return res.status(403).json({
            message: errorMessage
        });
    }
};
/*
  Log a user in by first finding their user object in the database then validating their password
  Once we verify their credentials, we send a cookie with a JWT attached and return their user object
  Related to LoginForm.tsx in client/src/components
*/
export const loginUser = async (req, res) => {
    // Find their user object by the email address provided in the client form
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).json({ message: "No user found with that email address" });
    }
    // Check if their password matches the encrypted password stored on their user object
    const valid_pass = await user.validatePassword(req.body.password);
    if (!valid_pass) {
        return res.status(400).json({ message: 'Wrong password!' });
    }
    // Create a JWT token
    const token = signToken(user._id);
    // Send a cookie back with the JWT attached
    res.cookie('book_app_token', token, {
        httpOnly: true,
        secure: process.env.PORT ? true : false,
        sameSite: true
    });
    return res.json({
        user: user
    });
};
// Clears the client-side cookie to log the user out
export const logoutUser = async (_, res) => {
    res.clearCookie('book_app_token');
    res.json({
        message: 'Logged out successfully!'
    });
};
