import 'dotenv/config';
import { sign } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from "../../../models/User";
import { validateUser } from '../../../middlewares/validate';
import { generateToken } from '../../../middlewares/token';

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
        const { error } = validateUser(req.body);
        if (error) return  res.status(400).json(error.details[0].message);

        const { name, email, password } = req.body;

        try {
            let user = await User.findOne({ email });

            if (user) return res.status(400).json({
                msg: 'User already exists'
            });

            user = new User({
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
              id: user._id,
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
     * @desc    Register cook
     * @param {object} req express request object
     * @param {object} res express response object
     * @returns {token} access token
     * @access Public
     * */
    static async registerCook(req, res) {
        const { error } = validateUser(req.body);
        if (error) return  res.status(400).json(error.details[0].message);

        const { name, email, password } = req.body;

        try {
            let user = await User.findOne({ email });

            if (user) return res.status(400).json({
                msg: 'User already exists'
            });

            user = new User({
                name,
                email,
                password,
                role: 'cook'
            });

            // Hash password before saving
            const salt = bcrypt.genSaltSync(10);
            user.password = bcrypt.hashSync(password, salt);

            await user.save();

            const payload = {
                id: user._id,
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
     * @desc    Register admin
     * @param {object} req express request object
     * @param {object} res express response object
     * @returns {token} access token
     * @access Public
     * */
    static async registerAdmin(req, res) {
        const { error } = validateUser(req.body);
        if (error) return  res.status(400).json(error.details[0].message);

        const { name, email, password } = req.body;

        try {
            let user = await User.findOne({ email });

            if (user) return res.status(400).json({
                msg: 'User already exists'
            });

            user = new User({
                name,
                email,
                password,
                role: 'admin'
            });

            // Hash password before saving
            const salt = bcrypt.genSaltSync(10);
            user.password = bcrypt.hashSync(password, salt);

            await user.save();

            const payload = {
                id: user._id,
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
}

export default UserController;