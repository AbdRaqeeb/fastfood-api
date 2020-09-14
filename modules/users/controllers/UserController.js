import 'dotenv/config';
import { sign } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from "../../../models/User";

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

    }
}

export default UserController;