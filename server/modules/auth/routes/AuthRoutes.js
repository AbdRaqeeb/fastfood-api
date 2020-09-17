import {Router} from 'express';
import verify from "../../../middlewares/verify";
import AuthController from "../controllers/AuthController";

const {loggedUser, loginAdmin, loginCook, loginCustomer, loggedAdmin, loggedCook} = AuthController;

const router = Router();

router.get('/cook', verify, loggedCook);
router.get('/admin', verify, loggedAdmin);
router.get('/', verify, loggedUser);
router.post('/admin', loginAdmin);
router.post('/cook', loginCook);
router.post('/', loginCustomer);

export default router;