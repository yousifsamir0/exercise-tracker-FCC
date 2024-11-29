import mongoose from "mongoose"
import * as dotenv from 'dotenv';
dotenv.config();


const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
const connectDB = () => {
    mongoose.connect(process.env.MONGO_URI, clientOptions).then(() => {
        console.log('MongoDB Connected...');
    });

}

export default connectDB;