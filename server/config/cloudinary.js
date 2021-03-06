import { v2 as cloudinary } from 'cloudinary';
import 'dotenv/config';

const Cloudinary = async () => {
    await cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET
    });
    console.log('Connected to cloudinary');
};

export default Cloudinary;