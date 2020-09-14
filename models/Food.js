import mongoose from 'mongoose';

const FoodSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    cost: {
        type: Number,
        number: true
    },
    cooking_duration: {
        type: Number,
        required: true
    },
    unit: {
        type: String,
        required: true
    }
});

const Food = mongoose.model('Food', FoodSchema);

export default Food;