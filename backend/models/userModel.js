import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: 'https://via.placeholder.com/40' },
    // avatar: { type: String, default: '' },
    // role: {type: String, enum: ['user', 'admin'], default: 'user'},
    cartData: { type: Object, default: {} },
}, {minimize: false})

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;