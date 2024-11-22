import mongoose from 'mongoose';

// Make sure to add the MONGODB_URL variable (cloud connection to your MongoDB database on Atlas) to your Render app environment variables
mongoose.connect(process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/googlebooks');

export default mongoose.connection;
