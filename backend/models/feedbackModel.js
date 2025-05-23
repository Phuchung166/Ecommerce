import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    feedback: { type: String, required: true }, 
    rating: { type: Number, required: true, min: 1, max: 5 }
}, { timestamps: true });//👈 dòng này để có createdAt và updatedAt

const feedbackModel = mongoose.models.feedback || mongoose.model('feedback', feedbackSchema);
export default feedbackModel;