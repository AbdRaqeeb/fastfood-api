import {Router} from 'express';
import FoodController from "../controllers/FoodController";
import verify from "../../../middlewares/verify";
import {authorize} from '../../../middlewares/authorize';
import Roles from '../../../helpers/roles';
import {checkCache} from "../../../middlewares/cache";

const router = Router();
const {addFood, getFood, getFoodInCategory, getFoods, updateFood, deleteFood, searchFood} = FoodController;

router.post('/', [verify, authorize(Roles.Admin)], addFood);
router.get('/search', checkCache, searchFood);
router.get('/category/:id', checkCache, getFoodInCategory);
router.get('/:id', checkCache, getFood);
router.get('/', checkCache, getFoods);
router.put('/:id', [verify, authorize([Roles.Admin, Roles.User])], updateFood);
router.delete('/:id', [verify, authorize(Roles.Admin)], deleteFood);

export default router;