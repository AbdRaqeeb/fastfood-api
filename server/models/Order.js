import mongoose from 'mongoose';

const OrderSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    reference: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    payment: {
        type: String,
        enum: ['cash on delivery', 'transfer'],
        default: 'transfer',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'ready'],
        required: true,
        default: 'pending'
    },
    delivery: {
        type: String,
        enum: ['eat in house', 'delivery'],
        default: 'eat in house',
        required: true
    },
    address: {
        type: String,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: String,
        enum: ['poor', 'fair', 'nice', 'excellent']
    },
    cook: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    phone: {
        type: String,
        required: true
    }
});

const Order = mongoose.model('Order', OrderSchema);

export default Order;