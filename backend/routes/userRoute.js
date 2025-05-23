import express from 'express';
import { loginUser, registerUser, adminLogin, getUserProfile, updateUserProfile, getAllUsers, updateUser, deleteUser } from '../controllers/userController.js';
import authUser from '../middleware/auth.js';
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin', adminLogin);

// Lấy thông tin user
userRouter.get('/me', authUser, getUserProfile);

// Cập nhật avatar
userRouter.put('/update', authUser, upload.single('avatar'), updateUserProfile);

// Admin routes
userRouter.get('/all', adminAuth, getAllUsers);
userRouter.put('/edit/:userId', adminAuth, updateUser);
userRouter.delete('/delete/:userId', adminAuth, deleteUser);

export default userRouter;