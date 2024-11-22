import { Schema, Types, type Document } from 'mongoose';

export interface BookDocument extends Document {
  _id: Types.ObjectId;
  googleBookId: string;
  title: string;
  authors: string[];
  description: string;
  image: string;
}

// This is a subdocument schema, it won't become its own model but we'll use it as the schema for the User's `savedBooks` array in User.js
const bookSchema = new Schema<BookDocument>({
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
