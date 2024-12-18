import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import { GraphQLError } from 'graphql';

dotenv.config();

import UserInterface from '../../interfaces/User';
import Context from '../../interfaces/Context';
import User from '../../models/User.js';

import { errorHandler } from '../helpers/index.js';

const { sign } = jwt;

function createToken(user_id: Types.ObjectId) {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
    }
    return sign({ user_id: user_id }, process.env.JWT_SECRET);
}

function getUserId(context: Context): Types.ObjectId | null {
    return context.req.user ? context.req.user._id : null;
}

const auth_resolvers = {
    Query: {
        async getUser(_: any, __: any, context: Context) {
            
            return {
                user: context.req.user || null
            };
        },
        async getUserBooks(_: any, __: any, context: Context) {
            try {
                if (!context.req.user) {
                    return[];
                }

                const user_id = context.req.user._id;
                const user = await User.findById(user_id).select('savedBooks');
                

                return user?.savedBooks || [];
            } catch (error) {
                console.error('Error fetching user books:', error);
                return [];
            }
        }
    },

    Mutation: {
        async registerUser(_: any, args: { username: string; email: string; password: string; }, context: Context) {
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
            } catch (error: any) {
                const errorMessage = errorHandler(error);

                throw new GraphQLError(errorMessage);
            }
        },

        async loginUser(_: any, args: { email: string; password: string; }, context: Context) {
            const user: UserInterface | null = await User.findOne({
                email: args.email
            });

            if (!user) {
                throw new GraphQLError('No user found with that email address');
            }

            const valid_pass = await user.validatePassword(args.password);

            if (!valid_pass) {
                throw new GraphQLError('Password is incorrect');
            }

            const token = createToken(user._id!);

            context.res.cookie('book_app_token', token, {
                httpOnly: true,
                secure: process.env.PORT ? true : false,
                sameSite: true
            });

            return {
                user: user
            };
        },

        logoutUser(_: any, __: any, context: Context) {
            context.res.clearCookie('book_app_token');

            return {
                message: 'Logged out successfully!'
            };
        },

            async saveBook(_: any, { input }: { input: any }, context: Context) {
                try {
                    const user_id = getUserId(context);

                    if (!user_id) {
                        throw new Error('User not authenticated');
                    }

                    console.log('Saving book for user:', user_id, 'Book input:', input);

                    const updatedUser = await User.findByIdAndUpdate(
                        user_id,
                        { $addToSet: { savedBooks: input } },
                        { new: true, runValidators: true }
                    );

                    if (!updatedUser) {
                        throw new Error('Failed to save book');
                    }

                    console.log('Book saved successfully:', updatedUser.savedBooks);

                    return { message: 'Book saved successfully!' };
                } catch (error) {
                    console.error('Error saving book:', error);
                    throw new Error('Error saving book');
                }
            },
          
        async deleteBook(_: any, args: any, context: Context) {
           

            if (!context.req.user) {
                throw new Error('User not authenticated');
            }
            const updatedUser = await User.findOneAndUpdate(
                { _id: context.req.user._id },
                { $pull: { savedBooks: { googleBookId: args.googleBookId } } },
                { new: true }
            );

            if (!updatedUser) {
                throw new Error("Couldn't find user with this ID");
            }

            return { message: 'Book deleted successfully!' };
        },
    },
};

export default auth_resolvers;
