import mongoose from 'mongoose';

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        max: 200,
        min: 5,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    role: {
        type:String,
        enum: ['user', 'cook', 'admin'],
        default: 'user',
        required: true
    },
    image: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

const User = mongoose.model('User', UserSchema);

export default User;