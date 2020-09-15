import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import fileUpload from 'express-fileupload';

//config files
import Cloudinary from "./config/cloudinary";
import connectDB from "./config/db";

//import routes
import UserRoutes from './modules/users/routes/UserRoutes';
import AuthRoutes from './modules/auth/routes/AuthRoutes';
import CategoryRoutes from './modules/category/routes/CategoryRoutes';

const app = express();

// Initiate middlewares
app.use(express.json({ extended: false }));
app.use(cors());
app.use(fileUpload({
    limits:{ fileSize: 10 * 1024 * 1024 }
}));


// Connect to database
// noinspection JSIgnoredPromiseFromCall
connectDB();

// Connect tp cloudinary API
// noinspection JSIgnoredPromiseFromCall
Cloudinary();

// routes
app.use('/users', UserRoutes);
app.use('/auth', AuthRoutes);
app.use('/category', CategoryRoutes);

const PORT = process.env.PORT || 6000;

app.listen(PORT, () => {
    console.log(`FastFood server running on port ${PORT}`);
});