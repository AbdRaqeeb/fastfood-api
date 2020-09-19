import {Order, OrderDetail, User, Cook} from '../../../database/models';
import {validateOrder} from '../../../middlewares/validate';
import {generateReference} from '../../../middlewares/referenceGenerator';
import db from '../../../database/models/index';

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
            const result = await db.sequelize.transaction(async t => {
                const order = await Order.create({
                    name: req.user.name,
                    reference: await generateReference(6),
                    amount: data.amount,
                    payment: data.payment,
                    address: data.address,
                    delivery: data.delivery,
                    user_id: req.user.id,
                    phone: data.phone,
                    comments: data.comments
                }, {transaction: t});

                const newOrderDetail = await orderDetails.map(detail => ({
                    ...detail,
                    order_id: order.order_id
                }));

                await OrderDetail.bulkCreate(newOrderDetail, {transaction: t, validate: true});

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
            const orders = await Order.findAll({
                include: [
                    {
                        model: User,
                        required: true
                    },
                    {
                        model: Cook,
                        required: true
                    }
                ]
            });

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
            const order = await Order.findByPk(req.params.id, {
                include: OrderDetail
            });

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
            const orders = await Order.findAll({
                where: {
                    user_id: req.user.id
                }
            });

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
        const {status, cook} = req.body;
        try {
            let order = await Order.findByPk(req.params.id);

            if (!order) return res.status(404).json({
                msg: 'Order not found'
            });

            // Build orderField
            const orderFields = {};
            if (status) orderFields.status = status;
            if (cook) orderFields.cook = cook;

            await order.update(orderFields);

            order = await Order.findByPk(req.params.id, {
                include: [
                    {
                        model: User,
                        required: true
                    },
                    {
                        model: Cook,
                        required: true
                    }
                ]
            });

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
            let order = await Order.findByPk(req.params.id);

            if (!order) return res.status(404).json({
                msg: 'Order not found'
            });

            if (req.user.id !== order.user_id) return res.status(403).json({
                msg: 'Unauthorized resource'
            });

            // Build orderField
            const orderFields = {};
            if (rating) orderFields.rating = rating;

            await order.update(orderFields);

            order = await Order.findByPk(req.params.id, {
                include: User
            });

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
            const order = await Order.findByPk(req.params.id);

            if (!order) return res.status(404).json({
                msg: 'Order not found'
            });

            await order.destroy({force: true});

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