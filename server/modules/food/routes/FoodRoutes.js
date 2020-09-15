import {Router} from 'express';
import FoodController from "../controllers/FoodController";
import verify from "../../../middlewares/verify";
import {authorize} from '../../../middlewares/authorize';
import Roles from '../../../helpers/roles';

const router = Router();
const {addFood, getFood, getFoodInCategory, getFoods, updateFood, deleteFood, searchFood} = FoodController;

router.post('/', [verify, authorize(Roles.Admin)], addFood);
router.get('/search', searchFood);
router.get('/category/:id', getFoodInCategory);
router.get('/:id', getFood);
router.get('/', getFoods);
router.put('/:id', [verify, authorize([Roles.Admin, Roles.User])], updateFood);
router.delete('/:id', [verify, authorize(Roles.Admin)], deleteFood);

export default router;