import mongoose from 'mongoose';
import feedbackModel from '../models/feedbackModel.js';
import orderModel from '../models/orderModel.js';


// Thêm phản hồi mới
export const addFeedback = async (req, res) => {
  try {
    const { productId, feedback, rating } = req.body;
    const userId = req.user.id;

    if (!productId || !userId || !feedback || !rating) {
      return res.json({ success: false, message: 'Thiếu các trường bắt buộc' });
    }

    if (rating < 1 || rating > 5) {
      return res.json({ success: false, message: 'Điểm đánh giá phải từ 1 đến 5' });
    }

    const existingFeedback = await feedbackModel.findOne({ productId, userId });
    if (existingFeedback) {
      return res.json({ success: false, message: 'Bạn đã gửi đánh giá cho sản phẩm này rồi' });
    }

    // Kiểm tra user đã mua sản phẩm này chưa
    const hasPurchased = await orderModel.findOne({
      userId,
      'items._id': productId,
    });
    if (!hasPurchased) {
      return res.json({ success: false, message: 'Bạn cần mua sản phẩm để gửi đánh giá' });
    }

    const newFeedback = new feedbackModel({
      productId,
      userId,
      feedback,
      rating
    });

    await newFeedback.save();
    res.json({ success: true, message: 'Đánh giá đã được gửi!' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Lấy tất cả phản hồi theo sản phẩm
export const getFeedbacksByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    // const { page = 1, limit = 10 } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const feedbacks = await feedbackModel
      .find({ productId })
      .populate('userId', 'name email avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await feedbackModel.countDocuments({ productId });
    res.json({ success: true, feedbacks, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


// Lấy tất cả phản hồi (cho admin)
export const getAllFeedbacks = async (req, res) => {
  try {
    const { search = '', userId = '' } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};

    // if (req.query.search) {
    //   query.$or = [
    //     { feedback: { $regex: search, $options: 'i' } },
    //     { 'userId.name': { $regex: search, $options: 'i' } },
    //     { 'userId.email': { $regex: search, $options: 'i' } },
    //     { 'productId.name': { $regex: search, $options: 'i' } },
    //   ];
    // }

    if (search.trim()) { // Chỉ áp dụng $or nếu search không rỗng
      query.$or = [
        { 'productId.name': { $regex: search, $options: 'i' } },
        { 'userId.name': { $regex: search, $options: 'i' } },
        { 'userId.email': { $regex: search, $options: 'i' } },
      ];
      console.log('Search query:', query); // Debug
    }


    // if (req.query.search) {
    //   if (mongoose.Types.ObjectId.isValid(search)) {
    //     // Nếu search là ObjectId hợp lệ, tìm chính xác theo productId hoặc userId
    //     query.$or = [
    //       { productId: search },
    //       { userId: search },
    //     ];
    //   } else {
    //     // Tìm kiếm theo tên sản phẩm, tên người dùng, hoặc email
    //     query.$or = [
    //       { 'productId.name': { $regex: search, $options: 'i' } },
    //       { 'userId.name': { $regex: search, $options: 'i' } },
    //       { 'userId.email': { $regex: search, $options: 'i' } },
    //     ];
    //   }
    // }

    if (userId) {
      query.userId = userId;
    }

    // const feedbacks = await feedbackModel
    //   .find(query)
    //   .populate('userId', 'name email avatar')
    //   .populate('productId', 'name')
    //   .sort({ createdAt: -1 })
    //   .skip(skip)
    //   .limit(limit);

    const feedbacks = await feedbackModel
      .find(query)
      .populate({
        path: 'userId',
        select: 'name email avatar',
        match: { _id: { $exists: true } }, // Chỉ populate userId tồn tại
      })
      .populate({
        path: 'productId',
        select: 'name',
        match: { _id: { $exists: true } }, // Chỉ populate productId tồn tại
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await feedbackModel.countDocuments(query);

    console.log('Found feedbacks:', feedbacks.length, 'Total:', total); // Debug

    res.json({ success: true, feedbacks, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error('getAllFeedbacks error:', error); // Debug
    res.json({ success: false, message: error.message });
  }
};


// Chỉnh sửa phản hồi
export const updateFeedback = async (req, res) => {
  try {
    const { feedbackId } = req.params;
    const { feedback, rating } = req.body;
    const userId = req.user.id;

    if (!feedback || !rating) {
      return res.json({ success: false, message: 'Thiếu nội dung phản hồi hoặc điểm đánh giá' });
    }

    if (rating < 1 || rating > 5) {
      return res.json({ success: false, message: 'Điểm đánh giá phải từ 1 đến 5' });
    }

    const feedbackDoc = await feedbackModel.findOne({ _id: feedbackId, userId });
    if (!feedbackDoc) {
      return res.json({ success: false, message: 'Không tìm thấy phản hồi hoặc bạn không có quyền chỉnh sửa' });
    }

    feedbackDoc.feedback = feedback;
    feedbackDoc.rating = rating;
    await feedbackDoc.save();

    res.json({ success: true, message: 'Phản hồi đã được cập nhật' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


// Xóa phản hồi
export const deleteFeedback = async (req, res) => {
  try {
    const { feedbackId } = req.params;
    const userId = req.user.id;

    const feedbackDoc = await feedbackModel.findOne({ _id: feedbackId, userId });
    if (!feedbackDoc) {
      return res.json({ success: false, message: 'Không tìm thấy đánh giá hoặc bạn không có quyền xóa' });
    }


    await feedbackModel.deleteOne({ _id: feedbackId });
    res.json({ success: true, message: 'Đánh giá đã được xóa' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const adminDeleteFeedback = async (req, res) => {
  try {
    const { feedbackId } = req.params;

    const feedbackDoc = await feedbackModel.findOne({ _id: feedbackId });
    if (!feedbackDoc) {
      return res.json({ success: false, message: 'Không tìm thấy đánh giá hoặc bạn không có quyền xóa' });
    }


    await feedbackModel.deleteOne({ _id: feedbackId });
    res.json({ success: true, message: 'Đánh giá đã được xóa' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


// Tính điểm đánh giá trung bình
export const getAverageRating = async (req, res) => {
  try {
    const { productId } = req.params;
    const feedbacks = await feedbackModel.find({ productId });
    const averageRating = feedbacks.length
      ? feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length
      : 0;
    res.json({ success: true, averageRating: averageRating.toFixed(1) });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

