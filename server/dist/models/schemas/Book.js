import { Schema } from 'mongoose';
// This is a subdocument schema, it won't become its own model but we'll use it as the schema for the User's `savedBooks` array in User.js
const bookSchema = new Schema({
    // saved book id from GoogleBooks
    googleBookId: {
        type: String,
        required: true,
    },
    authors: [
        {
            type: String,
        },
    ],
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    title: {
        type: String,
        required: true,
    },
});
export default bookSchema;
