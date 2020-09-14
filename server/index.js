import express from 'express';
import 'dotenv/config';
import cors from 'cors';

//config files
import Cloudinary from "../config/cloudinary";
import connectDB from "../config/db";

const app = express();

app.use(express.json({ extended: false }));
app.use(cors());


// Coonect to database
connectDB();

// Connect tp cloudinary API
Cloudinary();

const PORT = process.env.PORT || 6000;

app.listen(PORT, () => {
    console.log(`FastFood server running on port ${PORT}`);
});