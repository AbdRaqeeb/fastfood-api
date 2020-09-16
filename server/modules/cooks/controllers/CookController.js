import 'dotenv/config';
import bcrypt, {compareSync, genSaltSync, hashSync} from 'bcryptjs';
import {validatePassword, validateUser} from '../../../middlewares/validate';
import {generateToken} from '../../../middlewares/token';
import {Cook, Order} from '../../../database/models';
import {uploadImage} from "../../../middlewares/upload";
import folders from "../../../helpers/folders";

/**
 * @class CookController
 * @desc  Controllers for cooks
 * */
class CookController {
    /**
     * @static
     * @desc    Register cook
     * @param {object} req express request object
     * @param {object} res express response object
     * @returns {token} access token
     * @access Public
     * */
    static async registerCook(req, res) {
        const {error} = validateUser(req.body);
        if (error) return res.status(400).json(error.details[0].message);

        const {name, email, password} = req.body;

        try {
            let cook = await Cook.findOne({
                where: {
                    email
                }
            });

            if (cook) return res.status(400).json({
                msg: 'Cook already exists'
            });

            cook = Cook.build({
                name,
                email,
                password,
                role: 'cook'
            });

            // Hash password before saving
            const salt = bcrypt.genSaltSync(10);
            cook.password = bcrypt.hashSync(password, salt);

            await cook.save();

            const payload = {
                id: cook.id,
                name: cook.name,
                role: cook.role,
                email: cook.email
            };

            // generate token
            const token = generateToken(payload);

            res.status(200).json({
                token
            });
        } catch (e) {
            console.error(e.message);
            res.status(500).send('Internal server error...')
        }
    }

    /**
     * @static
     * @desc    Upload profile image
     * @param {object} req express request object
     * @param {object} res express response object
     * @returns {object} user profile
     * @access Private
     * */
    static async uploadProfilePhoto(req, res) {
        if (!req.files || Object.keys(req.files).length === 0) return res.status(400).json({
            msg: 'Please upload an image'
        });

        const image = await uploadImage(req.files.image, folders.cook);

        try {
            let cook = await Cook.findByPk(req.user.id);

            await cook.update({image});

            cook = await Cook.findByPk(cook.id, {
                include: Order
            });

            return res.status(200).json({
                msg: 'User updated successfully',
                cook
            })
        } catch (e) {
            console.error(e.message);
            res.status(500).send('Internal server error...');
        }
    }

    /**
     * @static
     * @desc    Update profile
     * @param {object} req express request object
     * @param {object} res express response object
     * @returns {object} user profile
     * @access Private
     * */
    static async updateProfile(req, res) {
        const {error} = validateUser(req.body, 'update');
        if (error) return res.status(400).json(error.details[0].message);

        try {
            let cook = await Cook.findByPk(req.user.id);

            await cook.update(req.body);

            cook = await Cook.findByPk(cook.id, {
                include: Order
            });

            return res.status(200).json({
                msg: 'Profile updated successfully',
                cook
            })
        } catch (e) {
            console.error(e.message);
            res.status(500).send('Internal server error...');
        }
    }


    /**
     * @static
     * @desc   Change password
     * @param {object} req express request object
     * @param {object} res express response object
     * @returns {object} user profile
     * @access Private
     * */
    static async changePassword(req, res) {
        const {error} = validatePassword(req.body);
        if (error) return res.status(400).json(error.details[0].message);


        const {old_password, new_password} = req.body;
        try {
            const cook = await Cook.findByPk(req.user.id);

            const validPassword = compareSync(old_password, cook.password);

            if (!validPassword) return res.status(400).json({
                msg: 'Password mismatch'
            });

            const salt = genSaltSync(10);
            cook.password = hashSync(new_password, salt);

            await cook.save();

            return res.status(200).json({
                msg: 'Password changed successfully',
            });

        } catch (e) {
            console.error(e.message);
            res.status(500).send('Internal server error...')
        }

    }
}

export default CookController;