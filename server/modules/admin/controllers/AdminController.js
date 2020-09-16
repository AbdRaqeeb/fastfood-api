import 'dotenv/config';
import bcrypt, {genSaltSync, hashSync, compareSync} from 'bcryptjs';
import {validatePassword, validateUser} from '../../../middlewares/validate';
import {generateToken} from '../../../middlewares/token';
import {Admin} from '../../../database/models';
import {uploadImage} from "../../../middlewares/upload";
import folders from "../../../helpers/folders";

/**
 * @class AdminController
 * @desc  Controllers for admin
 * */
class AdminController {
    /**
     * @static
     * @desc    Register admin
     * @param {object} req express request object
     * @param {object} res express response object
     * @returns {token} access token
     * @access Public
     * */
    static async registerAdmin(req, res) {
        const {error} = validateUser(req.body);
        if (error) return res.status(400).json(error.details[0].message);

        const {name, email, password} = req.body;

        try {
            let admin = await Admin.findOne({
                where: {
                    email
                }
            });

            if (admin) return res.status(400).json({
                msg: 'Admin already exists'
            });

            admin = Admin.build({
                name,
                email,
                password,
                role: 'admin'
            });

            // Hash password before saving
            const salt = bcrypt.genSaltSync(10);
            admin.password = bcrypt.hashSync(password, salt);

            await admin.save();

            const payload = {
                id: admin.id,
                name: admin.name,
                role: admin.role,
                email: admin.email
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

        const image = await uploadImage(req.files.image, folders.admin);

        try {
            let admin = await Admin.findByPk(req.user.id);

            admin = await admin.update({image});


            return res.status(200).json({
                msg: 'User updated successfully',
                admin
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
            let admin = await Admin.findByPk(req.user.id);

            admin = await admin.update(req.body);

            return res.status(200).json({
                msg: 'Profile updated successfully',
                admin
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
            const admin = await Admin.findByPk(req.user.id);

            const validPassword = compareSync(old_password, admin.password);

            if (!validPassword) return res.status(400).json({
                msg: 'Password mismatch'
            });

            const salt = genSaltSync(10);
            admin.password = hashSync(new_password, salt);

            await admin.save();

            return res.status(200).json({
                msg: 'Password changed successfully',
            });

        } catch (e) {
            console.error(e.message);
            res.status(500).send('Internal server error...')
        }

    }
}

export default AdminController;