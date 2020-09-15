import express from 'express';
import 'dotenv/config';
import cors from 'cors';

//config files
import Cloudinary from "./config/cloudinary";
import connectDB from "./config/db";

//import routes
import UserRoutes from './modules/users/routes/UserRoutes';
import AuthRoutes from './modules/auth/routes/AuthRoutes';

const app = express();

app.use(express.json({ extended: false }));
app.use(cors());


// Connect to database
// noinspection JSIgnoredPromiseFromCall
connectDB();

// Connect tp cloudinary API
// noinspection JSIgnoredPromiseFromCall
Cloudinary();

// routes
app.use('/users', UserRoutes);
app.use('/auth', AuthRoutes);

const PORT = process.env.PORT || 6000;

app.listen(PORT, () => {
    console.log(`FastFood server running on port ${PORT}`);
});