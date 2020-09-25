import {Router} from 'express';
import verify from "../../../middlewares/verify";
import AuthController from "../controllers/AuthController";
import {checkCache} from "../../../middlewares/cache";

const {loggedUser, loginAdmin, loginCook, loginCustomer, loggedAdmin, loggedCook} = AuthController;

const router = Router();

router.get('/cook', [verify, checkCache], loggedCook);
router.get('/admin', [verify, checkCache], loggedAdmin);
router.get('/', [verify, checkCache], loggedUser);
router.post('/admin', loginAdmin);
router.post('/cook', loginCook);
router.post('/', loginCustomer);

export default router;