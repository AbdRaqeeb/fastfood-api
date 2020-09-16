import bcrypt from 'bcryptjs';
import {uploadImage} from '../../../middlewares/upload';
import {validateLogin, validateUser} from '../../../middlewares/validate';
import {generateToken} from '../../../middlewares/token';
import {User, Cook, Admin, Order} from '../../../database/models';

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
            const user = await User.findByPk(req.user.id, {
                include: Order
            });

            res.status(200).json(user);
        } catch (e) {
            console.error(e.message);
            res.status(500).send('Internal server error')
        }
    }

    /**
     * @static
     * @desc    Get Logged in cook
     * @param {object} req express request object
     * @param {object} res express response object
     * @returns {object} cook profile
     * @access Private
     * */
    static async loggedCook(req, res) {
        try {
            const cook = await Cook.findByPk(req.user.id, {
                include: Order
            });

            res.status(200).json(cook);
        } catch (e) {
            console.error(e.message);
            res.status(500).send('Internal server error')
        }
    }


    /**
     * @static
     * @desc    Get Logged in admin
     * @param {object} req express request object
     * @param {object} res express response object
     * @returns {object} user profile
     * @access Private
     * */
    static async loggedAdmin(req, res) {
        try {
            const admin = await Admin.findByPk(req.user.id);

            res.status(200).json(admin);
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
        const {error} = validateLogin(req.body);
        if (error) return res.status(400).json(error.details[0].message);

        const {email, password} = req.body;

        try {
            const user = await User.findOne({
                where: {
                    email
                }
            });

            if (!user) return res.status(404).json({
                msg: 'Invalid email'
            });

            const validPassword = bcrypt.compareSync(password, user.password);

            if (!validPassword) return res.status(400).json({
                msg: 'Invalid password'
            });

            const payload = {
                id: user.id,
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
        const {error} = validateLogin(req.body);
        if (error) return res.status(400).json(error.details[0].message);

        const {email, password} = req.body;

        try {
            const cook = await Cook.findOne({
                where: {
                    email
                }
            });

            if (!cook) return res.status(404).json({
                msg: 'Invalid email'
            });

            const validPassword = bcrypt.compareSync(password, cook.password);

            if (!validPassword) return res.status(400).json({
                msg: 'Invalid password'
            });

            const payload = {
                id: cook.id,
                name: cook.name,
                email: cook.email,
                role: cook.role
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
        const {error} = validateLogin(req.body);
        if (error) return res.status(400).json(error.details[0].message);

        const {email, password} = req.body;

        try {
            const admin = await Admin.findOne({
                where: {
                    email
                }
            });

            if (!admin) return res.status(404).json({
                msg: 'Invalid email'
            });

            const validPassword = bcrypt.compareSync(password, admin.password);

            if (!validPassword) return res.status(400).json({
                msg: 'Invalid password'
            });

            const payload = {
                id: admin.id,
                name: admin.name,
                email: admin.email,
                role: admin.role
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

}

export default AuthController;