import {Food, Category} from '../../../database/models';
import {validateFood} from '../../../middlewares/validate';
import {uploadImages, uploadImage} from '../../../middlewares/upload';
import db from '../../../database/models/index';
import folders from "../../../helpers/folders";
import {addToCache} from "../../../middlewares/cache";
const {Op} = db.Sequelize;

/**
 * @class FoodController
 * @classdesc Controllers for food modules
 */
class FoodController {
    /**
     * @static
     * @desc    Add Food
     * @param {object} req express request object
     * @param {object} res express response object
     * @returns {object} food object
     * @access Private
     */
    static async addFood(req, res) {
        const {error} = validateFood(req.body);
        if (error) return res.status(400).json(error.details[0].message);

        const {name, unit_cost, cooking_duration, unit, category_id} = req.body;

        try {
            let food = await Food.findOne({
                where:
                    {
                        name,
                        category_id
                    }
            });

            if (food) return res.status(400).json({
                msg: 'Food already exists'
            });

            if (!req.files || Object.keys(req.files).length === 0) return res.status(400).json({
                msg: 'Please upload an image'
            });

            // array key is added to uploadImage in order to return single url as an array
            const images = (Object.keys(req.files).length === 1) ? await uploadImage(req.files.images, folders.foods, 'array'): await uploadImages(req.files.images);

            food = Food.build({
                name,
                unit_cost,
                cooking_duration,
                unit,
                category_id,
                images,
                admin_id: req.user.id
            });

            await food.save();

            return res.status(201).json({
                msg: 'Food added successfully',
                food
            });
        } catch (e) {
            console.error(e.message);
            res.status(500).send('Internal server error...');
        }
    }

    /**
     * @static
     * @desc   Get all foods
     * @param {object} req express request object
     * @param {object} res express response object
     * @returns {object} food object
     * @access Public
     */
    static async getFoods(req, res) {
        try {
            const foods = await Food.findAll({
                include: Category
            });

            if (foods.length < 1) return res.status(404).json({
                msg: 'No food available'
            });

            await addToCache(req.originalUrl, foods);

            return res.status(200).json({
                foods
            });
        } catch (e) {
            console.error(e.message);
            res.status(500).send('Internal server error');
        }
    }


    /**
     * @static
     * @desc   Get foods in a category
     * @param {object} req express request object
     * @param {object} res express response object
     * @returns {object} food object
     * @access Public
     */
    static async getFoodInCategory(req, res) {
        try {
            const foods = await Food.findAll({
                where: {
                    category_id: req.params.id
                },
                include: Category
            });

            if (foods.length < 1) return res.status(404).json({
                msg: 'Food not available in this category'
            });

            await addToCache(req.originalUrl, foods);

            return res.status(200).json({
                foods
            });
        } catch (e) {
            console.error(e.message);
            res.status(500).send('Internal server error...');
        }
    }

    /**
     * @static
     * @desc   Get a food by id
     * @param {object} req express request object
     * @param {object} res express response object
     * @returns {object} food object
     * @access Public
     */
    static async getFood(req, res) {
        try {
            const food = await Food.findByPk(req.params.id, {
                include: Category
            });

            if (!food) return res.status(404).json({
                msg: 'Food not found'
            });

            await addToCache(req.originalUrl, food);

            return res.status(200).json({
                food
            });
        } catch (e) {
            console.error(e.message);
            res.status(500).send('Internal server error...');
        }
    }

    /**
     * @static
     * @desc   Search food by name
     * @param {object} req express request object
     * @param {object} res express response object
     * @returns {object} food object
     * @access Public
     */
    static async searchFood(req, res) {
        const name = req.query.name;
        try {
            const foods = await Food.findAll({
                where: {
                    name: {
                        [Op.iLike]: `%${name}`
                    }
                }
            });

            if (foods.length < 1) return res.status(404).json({
                msg: 'No query match'
            });

            await addToCache(req.originalUrl, foods);

            return res.status(200).json({
                foods
            });
        } catch (e) {
            console.error(e.message);
            res.status(500).send('Internal server error...');
        }
    };

    /**
     * @static
     * @desc   Update food
     * @param {object} req express request object
     * @param {object} res express response object
     * @returns {object} food object
     * @access Private
     */
    static async updateFood(req, res) {
        const {error} = validateFood(req.body, 'update');
        if (error) return res.status(400).json(error.details[0].message);

        const {name, unit_cost, cooking_duration, unit, category, rating} = req.body;

        try {
            let food = await Food.findByPk(req.params.id);

            if (!food) return res.status(404).json({
                msg: 'Food not found'
            });

            const images = req.files ? await uploadImages(req.files.images) : food.images;
            // Build foodFields
            const foodFields = {};
            if (name) foodFields.name = name;
            if (unit_cost) foodFields.unit_cost = unit_cost;
            if (cooking_duration) foodFields.cooking_duration = cooking_duration;
            if (unit) foodFields.unit = unit;
            if (category) foodFields.category = category;
            if (rating) foodFields.rating = rating;
            foodFields.images = images;

            await food.update(foodFields);

            food = await Food.findByPk(req.params.id, {
                include: Category
            });

            return res.status(200).json({
                food
            });
        } catch (e) {
            console.error(e.message);
            res.status(500).send('Internal server error...');
        }

    }

    /**
     * @static
     * @desc   Delete food
     * @param {object} req express request object
     * @param {object} res express response object
     * @returns {object} food object
     * @access Private
     */
    static async deleteFood(req, res) {
        try {
            const food = await Food.findByPk(req.params.id);

            if (!food) return res.status(404).json({
                msg: 'Food not found'
            });

            await food.destroy({force: true});

            return res.status(200).json({
                msg: 'Food deleted successfully'
            });
        } catch (e) {
            console.error(e.message);
            res.status(500).send('Internal server error...');
        }
    }
}

export default FoodController;
