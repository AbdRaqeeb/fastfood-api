import mongoose from 'mongoose';

const OrderDetailSchema = mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    food: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Food',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    unit_cost: {
        type: Number,
        required: true
    }
});

const OrderDetail = mongoose.model('OrderDetail', OrderDetailSchema);

export default OrderDetail;