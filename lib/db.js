import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        if (!process.env.MONGO_URL) {
            throw new Error('MONGO_URL environment variable is not defined');
        }

        if (mongoose.connection.readyState === 1) {
            return mongoose.connection;
        }

        const conn = await mongoose.connect(process.env.MONGO_URL);
        
        console.log(`MongoDB connected: ${conn.connection.host}`);
        return conn;
    } catch (err) {
        console.error('DB connection error:', err);
        if (err.message.includes('whitelist')) {
            console.error('\nPlease make sure to:');
            console.error('1. Add your current IP address to MongoDB Atlas IP whitelist');
            console.error('2. Visit: https://www.mongodb.com/docs/atlas/security-whitelist/');
        }
        throw err;
    }
};

