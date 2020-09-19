import {Router} from 'express';
import OrderController from "../controllers/OrderController";
import verify from "../../../middlewares/verify";
import {authorize} from '../../../middlewares/authorize';
import Roles from '../../../helpers/roles';

const router = Router();
const {createOrder, getCustomerOrders, getOrders, getOrder, updateOrder, rateOrder, deleteOrder} = OrderController;

router.post('/', verify, createOrder);
router.get('/user', verify, getCustomerOrders);
router.get('/:id', [verify, authorize([Roles.Admin, Roles.Cook])], getOrder);
router.get('/', [verify, authorize([Roles.Admin, Roles.Cook])], getOrders);
router.put('/user/:id', verify, rateOrder);
router.put('/:id', [verify, authorize([Roles.Admin, Roles.Cook])], updateOrder);
router.delete('/:id', [verify, authorize(Roles.Admin)], deleteOrder);

export default router;