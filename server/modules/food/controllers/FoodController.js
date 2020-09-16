import Food from "../../../models/Food";
import {validateFood} from '../../../middlewares/validate';
import {uploadImages} from '../../../middlewares/upload';

/**
 * @class Food Controller
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

        const {name, unit_cost, cooking_duration, unit, category} = req.body;

        try {
            let food = await Food.findOne({name, category});

            if (food) return res.status(400).json({
                msg: 'Food already exists'
            });

            if (!req.files || Object.keys(req.files).length === 0) return res.status(400).json({
                msg: 'Please upload an image'
            });

            const images = await uploadImages(req.files);

            food = new Food({
                name,
                unit_cost,
                cooking_duration,
                unit,
                category,
                images
            });

            await food.save();

            return res.status(201).json({
                msg: 'Food added successfully',
                food
            });
        } catch (e) {
            console.error(e.message);
            res.status(500).send('Internal server error...')
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
            const foods = await Food.find({}, {
                sort: {
                    name: 1
                }
            }).populate('Category', 'name -_id');

            if (foods.length < 1) return res.status(404).json({
                msg: 'No food available'
            });

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
            const foods = await Food.find({
                category: req.params.id
            }, {
                sort: {
                    name: 1
                }
            }).populate('Category', 'name, -_id');

            if (foods.length < 1) return res.status(404).json({
                msg: 'Food not available in this category'
            });

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
            const food = await Food.findById(req.params.id)
                .populate('Category', 'name -_id');

            if (!food) return res.status(404).json({
                msg: 'Food not found'
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
     * @desc   Search food by name
     * @param {object} req express request object
     * @param {object} res express response object
     * @returns {object} food object
     * @access Public
     */
    static async searchFood(req, res) {
        const name = req.query.name;
        try {
            const foods = await Food.find({
                $text: {
                    $search: name
                }
            }).sort('name').populate('Category', 'name -_id');

            if (foods.length < 1) return res.status(404).json({
                msg: 'No query match'
            });

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
            let food = await Food.findById(req.params.id);

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

            await Food.findByIdAndUpdate(req.params.id, {
                    $set: foodFields
                }
            );

            food = await Food.findById(req.params.id)
                .populate('Category', 'name -_id');

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
            const food = await Food.findById(req.params.id);

            if (!food) return res.status(404).json({
                msg: 'Food not found'
            });

            await Food.findByIdAndRemove(req.params.id);

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
