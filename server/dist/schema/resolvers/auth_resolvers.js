import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';
dotenv.config();
import User from '../../models/User.js';
import { errorHandler } from '../helpers/index.js';
const { sign } = jwt;
function createToken(user_id) {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
    }
    return sign({ user_id: user_id }, process.env.JWT_SECRET);
}
function getUserId(context) {
    return context.req.user ? context.req.user._id : null;
}
const auth_resolvers = {
    Query: {
        async getUser(_, __, context) {
            return {
                user: context.req.user || null
            };
        },
        async getUserBooks(_, __, context) {
            try {
                if (!context.req.user) {
                    return [];
                }
                const user_id = context.req.user._id;
                const user = await User.findById(user_id).select('savedBooks');
                return user?.savedBooks || [];
            }
            catch (error) {
                console.error('Error fetching user books:', error);
                return [];
            }
        }
    },
    Mutation: {
        async registerUser(_, args, context) {
            try {
                const user = await User.create(args);
                const token = createToken(user._id);
                context.res.cookie('book_app_token', token, {
                    httpOnly: true,
                    secure: process.env.PORT ? true : false,
                    sameSite: true
                });
                return {
                    user: user
                };
            }
            catch (error) {
                const errorMessage = errorHandler(error);
                throw new GraphQLError(errorMessage);
            }
        },
        async loginUser(_, args, context) {
            const user = await User.findOne({
                email: args.email
            });
            if (!user) {
                throw new GraphQLError('No user found with that email address');
            }
            const valid_pass = await user.validatePassword(args.password);
            if (!valid_pass) {
                throw new GraphQLError('Password is incorrect');
            }
            const token = createToken(user._id);
            context.res.cookie('book_app_token', token, {
                httpOnly: true,
                secure: process.env.PORT ? true : false,
                sameSite: true
            });
            return {
                user: user
            };
        },
        logoutUser(_, __, context) {
            context.res.clearCookie('book_app_token');
            return {
                message: 'Logged out successfully!'
            };
        },
        async saveBook(_, { input }, context) {
            try {
                const user_id = getUserId(context);
                if (!user_id) {
                    throw new Error('User not authenticated');
                }
                console.log('Saving book for user:', user_id, 'Book input:', input);
                const updatedUser = await User.findByIdAndUpdate(user_id, { $addToSet: { savedBooks: input } }, { new: true, runValidators: true });
                if (!updatedUser) {
                    throw new Error('Failed to save book');
                }
                console.log('Book saved successfully:', updatedUser.savedBooks);
                return { message: 'Book saved successfully!' };
            }
            catch (error) {
                console.error('Error saving book:', error);
                throw new Error('Error saving book');
            }
        },
        async deleteBook(_, args, context) {
            if (!context.req.user) {
                throw new Error('User not authenticated');
            }
            const updatedUser = await User.findOneAndUpdate({ _id: context.req.user._id }, { $pull: { savedBooks: { googleBookId: args.googleBookId } } }, { new: true });
            if (!updatedUser) {
                throw new Error("Couldn't find user with this ID");
            }
            return { message: 'Book deleted successfully!' };
        },
    },
};
export default auth_resolvers;
