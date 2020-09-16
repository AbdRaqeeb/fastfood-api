import bcrypt from 'bcryptjs';
import {uploadImage} from '../../../middlewares/upload';
import User from '../../../models/User';
import {validateLogin, validateUser} from '../../../middlewares/validate';
import {generateToken} from '../../../middlewares/token';

/**
 * @class AuthController
 * @desc User login
 * */
class AuthController {
    /**
     * @static
     * @desc    Get Logged in user
     * @param {object} req express request object
     * @param {object} res express response object
     * @returns {object} user profile
     * @access Private
     * */
    static async loggedUser(req, res) {
        try {
            const user = await User.findById(req.user.id).select('-password');

            res.status(200).json(user);
        } catch (e) {
            console.error(e.message);
            res.status(500).send('Internal server error')
        }
    }


    /**
     * @static
     * @desc    Login customer
     * @param {object} req express request object
     * @param {object} res express response object
     * @returns {token} access token
     * @access Public
     * */
    static async loginCustomer(req, res) {
        const { error } = validateLogin(req.body);
        if (error) return  res.status(400).json(error.details[0].message);

        const { email, password } = req.body;

        try {
            const user = await User.findOne({ email });

            if (!user) return res.status(404).json({
                msg: 'Invalid email'
            });

            if (user.role === 'admin' || user.role === 'cook' || user.isActive === false)
                return res.status(400).json({
                   msg: 'Permission denied'
                });

            const validPassword = bcrypt.compareSync(password, user.password);

            if (!validPassword) return res.status(400).json({
                msg: 'Invalid password'
            });

            const payload = {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            };

            // generate token
            const token = generateToken(payload);

            res.status(200).json({
                token
            });

        } catch (e) {
            console.error(e.message);
            res.status(500).send('Internal server error...');
        }
    }

    /**
     * @static
     * @desc    Login cook
     * @param {object} req express request object
     * @param {object} res express response object
     * @returns {token} access token
     * @access Public
     * */
    static async loginCook(req, res) {
        const { error } = validateLogin(req.body);
        if (error) return  res.status(400).json(error.details[0].message);

        const { email, password } = req.body;

        try {
            const user = await User.findOne({ email });

            if (!user) return res.status(404).json({
                msg: 'Invalid email'
            });

            if (user.role === 'user' || user.role === 'admin' || user.isActive === false)
                return res.status(400).json({
                    msg: 'Permission denied'
                });

            const validPassword = bcrypt.compareSync(password, user.password);

            if (!validPassword) return res.status(400).json({
                msg: 'Invalid password'
            });

            const payload = {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            };

            // generate token
            const token = generateToken(payload);

            res.status(200).json({
                token
            });

        } catch (e) {
            console.error(e.message);
            res.status(500).send('Internal server error...');
        }
    }


    /**
     * @static
     * @desc    Login admin
     * @param {object} req express request object
     * @param {object} res express response object
     * @returns {token} access token
     * @access Public
     * */
    static async loginAdmin(req, res) {
        const { error } = validateLogin(req.body);
        if (error) return  res.status(400).json(error.details[0].message);

        const { email, password } = req.body;

        try {
            const user = await User.findOne({ email });

            if (!user) return res.status(404).json({
                msg: 'Invalid email'
            });

            if (user.role === 'user' || user.role === 'cook' || user.isActive === false)
                return res.status(400).json({
                    msg: 'Permission denied'
                });

            const validPassword = bcrypt.compareSync(password, user.password);

            if (!validPassword) return res.status(400).json({
                msg: 'Invalid password'
            });

            const payload = {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            };

            // generate token
            const token = generateToken(payload);

            res.status(200).json({
                token
            });

        } catch (e) {
            console.error(e.message);
            res.status(500).send('Internal server error...');
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

        const image = await uploadImage(req.files.image, 1);

        try {
            const user = await User.findByIdAndUpdate(req.user.id, {
                $set: {
                    image
                }
            },
                {
                    new: true
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
        const { error } = validateUser(req.body, 'update');
        if (error) return  res.status(400).json(error.details[0].message);

        const { name, password, phone,  } = req.body;

        try {

            // Build userFields object
            const userFields = {};
            if (name) userFields.name = name;
            if (phone) userFields.phone = phone;

            if (password) {
                const salt = bcrypt.genSaltSync(10);

                userFields.password = bcrypt.hashSync(password, salt);
            }

            const user = await User.findByIdAndUpdate(req.user.id, {
                $set: userFields
            },
                {
                    new: true
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

}

export default AuthController;