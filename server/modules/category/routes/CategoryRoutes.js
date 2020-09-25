import { Router } from 'express';
import CategoryController from "../controllers/CategoryController";
import verify from "../../../middlewares/verify";
import {authorize} from '../../../middlewares/authorize';
import Roles from '../../../helpers/roles';
import {checkCache} from "../../../middlewares/cache";

const router = Router();
const {addCategory, getCategories, getCategory, updateCategory, deleteCategory} = CategoryController;

router.post('/', [verify, authorize(Roles.Admin)], addCategory);
router.get('/:id', checkCache, getCategory);
router.get('/', checkCache, getCategories);
router.put('/:id', [verify, authorize(Roles.Admin)], updateCategory);
router.delete('/:id', [verify, authorize(Roles.Admin)], deleteCategory);

export default router;