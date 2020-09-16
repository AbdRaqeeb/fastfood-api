import {Router} from 'express';
import CookController from "../controllers/CookController";
import verify from "../../../middlewares/verify";

const router = Router();
const {registerCook, changePassword, updateProfile, uploadProfilePhoto} = CookController;

router.post('/', registerCook);
router.put('/upload', verify, uploadProfilePhoto);
router.put('/password', verify, changePassword);
router.put('/', verify, updateProfile);

export default router;