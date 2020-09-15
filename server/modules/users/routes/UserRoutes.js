import { Router } from 'express';
import UserController from "../controllers/UserController";
const { registerCustomer, registerCook, registerAdmin } = UserController;

const router = Router();

router.post('/admin', registerAdmin);
router.post('/cook', registerCook);
router.post('/', registerCustomer);

export default router;