import {Category, Food} from '../../../database/models';
import {validateCategory} from '../../../middlewares/validate';
import {uploadImage} from '../../../middlewares/upload';
import folders from "../../../helpers/folders";
import {addToCache} from "../../../middlewares/cache";

/**
 * @class CategoryController
 * @classdesc Controllers for food category
 * */

class CategoryController {
    /**
     *@static
     * @desc    Add a food category
     * @param {object} req express request object
     * @param {object} res express response object
     * @returns {object} category object
     * @access Private
     */
    static async addCategory(req, res) {
        const {error} = validateCategory(req.body);
        if (error) return res.status(400).json(error.details[0].message);

        const {name, description} = req.body;

        try {
            let category = await Category.findOne({
                where: {
                    name
                }
            });

            if (category) return res.status(400).json({
                msg: 'Category already exists'
            });

            if (!req.files || Object.keys(req.files).length === 0) return res.status(400).json({
                msg: 'Please upload an image'
            });

            const image = await uploadImage(req.files.image, folders.category);

            category = Category.build({
                name,
                description,
                image
            });

            await category.save();

            return res.status(201).json({
                msg: 'Category created successfully',
                category
            });
        } catch (e) {
            console.error(e.message);
            res.status(500).send('Internal server error...')
        }
    }

    /**
     *@static
     * @desc    Get all food categories
     * @param {object} req express request object
     * @param {object} res express response object
     * @returns {object} category object
     * @access Public
     */
    static async getCategories(req, res) {
        try {
            const categories = await Category.findAll();

            if (categories.length < 1) return res.status(404).json({
                msg: 'No categories available'
            });

            await addToCache(req.originalUrl, categories);
            return res.status(200).json({
                categories
            });
        } catch (e) {
            console.error(e.message);
            res.status(500).send('Internal server error..')
        }
    }

    /**
     *@static
     * @desc    Get a food category by id
     * @param {object} req express request object
     * @param {object} res express response object
     * @returns {object} category object
     * @access Public
     */
    static async getCategory(req, res) {
        try {
            const category = await Category.findByPk(req.params.id, {
                include: Food
            });

            if (!category) return res.status(404).json({
                msg: 'Category not found'
            });

            await addToCache(req.originalUrl, category);
            return res.status(200).json({
                category
            });
        } catch (e) {
            console.error(e.message);
            res.status(500).send('Internal server error...')
        }
    }

    /**
     *@static
     * @desc    Update food category
     * @param {object} req express request object
     * @param {object} res express response object
     * @returns {object} category object
     * @access Private
     */
    static async updateCategory(req, res) {
        const {error} = validateCategory(req.body, 'update');
        if (error) return res.status(400).json(error.details[0].message);

        const {name, description} = req.body;

        try {
            let category = await Category.findByPk(req.params.id);

            if (!category) return res.status(404).json({
                msg: 'Category not found'
            });

            const image = req.files ? await uploadImage(req.files.image, 2) : category.image;

            // Build category field
            const categoryField = {};
            if (name) categoryField.name = name;
            if (description) categoryField.description = description;
            categoryField.image = image;

            await category.update(categoryField);

            category = await Category.findByPk(req.params.id, {
                include: Food
            });

            return res.status(200).json({
                msg: 'Category updated successfully',
                category
            });
        } catch (e) {
            console.error(e.message);
            res.status(500).send('Internal server error');
        }
    }

    /**
     *@static
     * @desc   Delete food category
     * @param {object} req express request object
     * @param {object} res express response object
     * @returns {object} category object
     * @access Private
     */
    static async deleteCategory(req, res) {
        try {
            const category = await Category.findByPk(req.params.id);

            if (!category) return res.status(404).json({
                msg: 'Category not found'
            });

            await category.destroy({force: true});

            return res.status(200).json({
                msg: 'Category deleted successfully'
            });
        } catch (e) {
            console.error(e.message);
            res.status(500).send('Internal server error');
        }
    }
}

export default CategoryController;