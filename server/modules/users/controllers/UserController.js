import 'dotenv/config';
import bcrypt, {genSaltSync, hashSync, compareSync} from 'bcryptjs';
import {validateUser, validatePassword} from '../../../middlewares/validate';
import {generateToken} from '../../../middlewares/token';
import {User, Order} from '../../../database/models';
import {uploadImage} from "../../../middlewares/upload";
import folders from "../../../helpers/folders";

/**
 * @class UserController
 * @desc User registration
 * */
class UserController {
    /**
     * @static
     * @desc    Register a customer
     * @param {object} req express request object
     * @param {object} res express response object
     * @returns {token} access token
     * @access Public
     * */
    static async registerCustomer(req, res) {
        const {error} = validateUser(req.body);
        if (error) return res.status(400).json(error.details[0].message);

        const {name, email, password} = req.body;

        try {
            let user = await User.findOne({
                where: {
                    email
                }
            });

            if (user) return res.status(400).json({
                msg: 'User already exists'
            });

            user = User.build({
                name,
                email,
                password,
                role: 'user'
            });

            // Hash password before saving
            const salt = bcrypt.genSaltSync(10);
            user.password = bcrypt.hashSync(password, salt);

            await user.save();

            const payload = {
                id: user.id,
                name: user.name,
                role: user.role,
                email: user.email
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

        const image = await uploadImage(req.files.image, folders.users);

        try {
            let user = await User.findByPk(req.user.id);

            await user.update({image});

            user = await User.findByPk(user.id, {
                include: Order
            });

            return res.status(200).json({
                msg: 'User updated successfully',
                user
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
            let user = await User.findByPk(req.user.id);

            await user.update(req.body);

            user = await User.findByPk(user.id, {
                include: Order
            });

            return res.status(200).json({
                msg: 'Profile updated successfully',
                user
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
            const user = await User.findByPk(req.user.id);

            const validPassword = compareSync(old_password, user.password);

            if (!validPassword) return res.status(400).json({
                msg: 'Password mismatch'
            });

            const salt = genSaltSync(10);
            user.password = hashSync(new_password, salt);

            await user.save();

            return res.status(200).json({
                msg: 'Password changed successfully',
            });

        } catch (e) {
            console.error(e.message);
            res.status(500).send('Internal server error...')
        }

    }
}

export default UserController;