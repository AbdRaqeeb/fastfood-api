import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import fileUpload from 'express-fileupload';

//config files
import Cloudinary from "./config/cloudinary";
import Models from "./database/models";

//import routes
import UserRoutes from './modules/users/routes/UserRoutes';
import CookRoutes from './modules/cooks/routes/CookRoutes';
import AdminRoutes from './modules/admin/routes/AdminRoutes';
import AuthRoutes from './modules/auth/routes/AuthRoutes';
import CategoryRoutes from './modules/category/routes/CategoryRoutes';
import FoodRoutes from './modules/food/routes/FoodRoutes';
import OrderRoutes from './modules/order/routes/OrderRoutes';

const app = express();

// Initiate middlewares
app.use(express.json({extended: false}));
app.use(cors());
app.use(fileUpload({
    limits:{ fileSize: 10 * 1024 * 1024 }
}));


// Connect to database
Models.sequelize.sync()
    .then(() => console.log('Database synced'))
    .catch(err => console.log('Unable to sync database', err));

// Connect tp cloudinary API
// noinspection JSIgnoredPromiseFromCall
Cloudinary();

// routes
app.use('api/v1/users', UserRoutes);
app.use('api/v1/cooks', CookRoutes);
app.use('api/v1/admin', AdminRoutes);
app.use('api/v1/auth', AuthRoutes);
app.use('api/v1/category', CategoryRoutes);
app.use('api/v1/food', FoodRoutes);
app.use('api/v1/order', OrderRoutes);

const PORT = process.env.PORT || 6000;

app.listen(PORT, () => {
    console.log(`FastFood server running on port ${PORT}`);
});