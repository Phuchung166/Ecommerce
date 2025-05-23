import express from 'express';
import { addFeedback, deleteFeedback, getAverageRating, getFeedbacksByProduct, updateFeedback, getAllFeedbacks, adminDeleteFeedback } from '../controllers/feedbackController.js';
import authUser from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';

const feedbackRouter = express.Router();

feedbackRouter.post('/add', authUser, addFeedback);
feedbackRouter.put('/update/:feedbackId', authUser, updateFeedback);
feedbackRouter.delete('/delete/:feedbackId', authUser, deleteFeedback);


feedbackRouter.get('/product/:productId', getFeedbacksByProduct);
feedbackRouter.get('/average/:productId', getAverageRating);


feedbackRouter.get('/all', adminAuth, getAllFeedbacks);
feedbackRouter.delete('/admin/delete/:feedbackId', adminAuth, adminDeleteFeedback);

export default feedbackRouter;