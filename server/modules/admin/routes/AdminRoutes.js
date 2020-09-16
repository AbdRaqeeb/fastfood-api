import {Router} from 'express';
import AdminController from "../controllers/AdminController";
import verify from "../../../middlewares/verify";

const router = Router();
const {registerAdmin, updateProfile, uploadProfilePhoto, changePassword} = AdminController;

router.post('/', registerAdmin);
router.put('/upload', verify, uploadProfilePhoto);
router.put('/password', verify, changePassword);
router.put('/', verify, updateProfile);

export default router;