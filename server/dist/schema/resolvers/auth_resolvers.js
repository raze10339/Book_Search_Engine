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
        async GetUser(_, __, context) {
            if (!context.req.user) {
                return {
                    user: null
                };
            }
            const user_id = context.req.user._id;
            const user = await User.findById(user_id).select('_id username savedBooks');
            return user || null;
        },
        async GetUserBooks(_, __, context) {
            if (!context.req.user) {
                return {
                    errors: ['You are not authorized to perform this action']
                };
            }
            const user_id = context.req.user._id;
            const user = await User.findById(user_id);
            return user?.savedBooks || [];
        },
    },
    Mutation: {
        async RegisterUser(_, args, context) {
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
        async LoginUser(_, args, context) {
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
        LogoutUser(_, __, context) {
            context.res.clearCookie('book_app_token');
            return {
                message: 'Logged out successfully!'
            };
        },
        async SaveBook(_, args, context) {
            const user_id = getUserId(context);
            if (!user_id) {
                throw new Error('User not authenticated');
            }
            await User.findOneAndUpdate({ _id: user_id }, { $addToSet: { savedBooks: args.input } }, { new: true, runValidators: true });
            return { message: 'Book saved successfully!' };
        },
        async DeleteBook(_, args, context) {
            const user_id = getUserId(context);
            if (!user_id) {
                throw new Error('User not authenticated');
            }
            const updatedUser = await User.findOneAndUpdate({ _id: user_id }, { $pull: { savedBooks: { googleBookId: args.bookId } } }, { new: true });
            if (!updatedUser) {
                throw new Error("Couldn't find user with this ID");
            }
            return { message: 'Book deleted successfully!' };
        },
    },
};
export default auth_resolvers;
