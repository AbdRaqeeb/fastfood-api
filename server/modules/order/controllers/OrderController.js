import Order from "../../../models/Order";
import OrderDetail from "../../../models/OrderDetail";
import {validateOrder} from '../../../middlewares/validate';
import {runInTransaction} from 'mongoose-transact-utils';
import {generateReference} from '../../../middlewares/referenceGenerator';

/**
 *@class Order Controller
 * @classdesc Controllers for orders
 */
class OrderController {
    /**
     * @static
     * @desc Make order
     * @param {object} req express request object
     * @param {object} res express response object
     * @returns {object} order object
     * @access Private
     */
    static async createOrder(req, res) {
        const {error} = validateOrder(req.body);
        if (error) return res.status(400).json(error.details[0].message);

        const data = req.body;
        const orderDetails = data.data;

        try {
            const result = await runInTransaction(async session => {
                const order = await Order.create({
                    name: req.user.name,
                    reference: generateReference(6),
                    amount: data.amount,
                    payment: data.payment,
                    address: data.address,
                    delivery: data.delivery,
                    owner: req.user.id,
                    phone: data.phone
                }).session(session);

                const newOrderDetail = await orderDetails.map(detail => ({
                    ...detail,
                    order: order._id
                }));

                await OrderDetail.create(newOrderDetail).session(session);

                return order;
            });

            res.status(201).json({
                msg: 'Order made successfully',
                result
            })
        } catch (e) {
            console.error(e.message);
            res.status(500).send('Internal server error...');
        }
    }


    /**
     * @static
     * @desc Get all orders
     * @param {object} req express request object
     * @param {object} res express response object
     * @returns {object} order object
     * @access Private
     */
    static async getOrders(req, res) {
        try {
            const orders = await Order.find({}).populate('User', 'name -_id');

            if (orders.length < 1) return res.status(404).json({
                msg: 'No orders available'
            });

            return res.status(200).json({
                orders
            });
        } catch (e) {
            console.error(e.message);
            res.status(500).send('Internal server error...')
        }
    }

    /**
     * @static
     * @desc Get one order
     * @param {object} req express request object
     * @param {object} res express response object
     * @returns {object} order object
     * @access Private
     */
    static async getOrder(req, res) {
        try {
            const order = await Order.findById(req.params.id).populate('User', 'name -_id');

            if (!order) return res.status(404).json({
                msg: 'Order not found'
            });

            const orderDetails = await OrderDetail.find({
                order: order._id
            }).populate('Food', '-_id');

            return res.status(200).json({
                order,
                orderDetails
            });
        } catch (e) {
            console.error(e.message);
            res.status(500).send('Internal server error...');
        }
    }

    /**
     * @static
     * @desc Get one customer orders
     * @param {object} req express request object
     * @param {object} res express response object
     * @returns {object} order object
     * @access Private
     */
    static async getCustomerOrders(req, res) {
        try {
            const orders = await Order.find({
                owner: req.user.id,
            }).populate('User', 'name -_id');

            if (orders.length < 1) return res.status(404).json({
                msg: 'No orders available'
            });

            return res.status(200).json({
                orders
            });
        } catch (e) {
            console.error(e.message);
            res.status(500).send('Internal server error...')
        }
    }

    /**
     * @static
     * @desc Update Order
     * @param {object} req express request object
     * @param {object} res express response object
     * @returns {object} order object
     * @access Private
     */
    static async updateOrder(req, res) {
        const {rating, status, cook} = req.body;
        try {
            let order = await Order.findById(req.params.id);

            if (!order) return res.status(404).json({
                msg: 'Order not found'
            });

            // Build orderField
            const orderFields = {};
            if (status) orderFields.status = status;
            if (cook) orderFields.cook = cook;

            await Order.findByIdAndUpdate(req.params.id, {
                $set: orderFields
            });

            order = await Order.findById(req.params.id).populate('User', 'name -_id');

            return res.status(200).json({
                msg: 'Order updated successfully',
                order
            });
        } catch (e) {
            console.error(e.message);
            res.status(500).send('Internal server error...');
        }
    }

    /**
     * @static
     * @desc Rate Order
     * @param {object} req express request object
     * @param {object} res express response object
     * @returns {object} order object
     * @access Private
     */
    static async rateOrder(req, res) {
        const {rating} = req.body;
        try {
            let order = await Order.findById(req.params.id);

            if (!order) return res.status(404).json({
                msg: 'Order not found'
            });

            if (req.user.id !== order.owner) return ress.status(403).json({
                msg: 'Unauthorized resource'
            });

            // Build orderField
            const orderFields = {};
            if (rating) orderFields.rating = rating;

            await Order.findByIdAndUpdate(req.params.id, {
                $set: orderFields
            });

            order = await Order.findById(req.params.id).populate('User', 'name -_id');

            return res.status(200).json({
                msg: 'Order updated successfully',
                order
            });
        } catch (e) {
            console.error(e.message);
            res.status(500).send('Internal server error...');
        }
    }

    /**
     * @static
     * @desc Delete Order
     * @param {object} req express request object
     * @param {object} res express response object
     * @returns {object} order object
     * @access Private
     */
    static async deleteOrder(req, res) {
        try {
            const order = await Order.findById(req.params.id);

            if (!order) return res.status(404).json({
                msg: 'Order not found'
            });

            await Order.findByIdAndRemove(req.params.id);

            return res.status(200).json({
                msg: 'Order deleted successfully'
            });
        } catch (e) {
            console.error(e.message);
            res.status(500).send('Internal server error...');
        }
    }
}

export default OrderController;