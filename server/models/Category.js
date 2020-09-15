import mongoose from 'mongoose';

const CategorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        max: 100
    },
    description: {
        type: String,
        max: 200
    },
    image: {
        type: String
    }
});

const Category = mongoose.model('Category', CategorySchema);

export default Category;