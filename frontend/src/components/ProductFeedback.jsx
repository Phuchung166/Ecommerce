import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';

const ProductFeedback = ({ productId, currentUserId }) => {
    const { backendUrl } = useContext(ShopContext)
    const [rating, setRating] = useState(0);
    const [editRating, setEditRating] = useState(0);
    const [newFeedback, setNewFeedback] = useState('');
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [listLoading, setListLoading] = useState(false);
    const [editingFeedbackId, setEditingFeedbackId] = useState(null);
    const [editFeedback, setEditFeedback] = useState('');
    const [canReview, setCanReview] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [deleteConfirm, setDeleteConfirm] = useState(null);


    const fetchFeedbacks = async () => {
        setListLoading(true);
        try {
            const res = await axios.get(`${backendUrl}/api/feedback/product/${productId}?page=${page}&limit=10`);
            if (res.data.success) {
                setFeedbacks(res.data.feedbacks);
                setTotalPages(Math.ceil(res.data.total / res.data.limit));
            } else {
                toast.error(res.data.message);
            }
        } catch (err) {
            toast.error('Lỗi khi tải danh sách phản hồi');
        } finally {
            setListLoading(false);
        }
    };

    const handleFeedbackSubmit = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Vui lòng đăng nhập để gửi đánh giá');
            return;
        }

        if (!newFeedback.trim() || rating === 0) {
            toast.error('Vui lòng nhập nội dung đánh giá và chọn số sao');
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post(
                `${backendUrl}/api/feedback/add`,
                { productId, feedback: newFeedback, rating },
                { headers: { token } }
            );

            if (res.data.success) {
                setNewFeedback('');
                setRating(0);
                fetchFeedbacks();
                toast.success('Đánh giá đã được gửi!');
            } else {
                toast.error(res.data.message);
            }
        } catch (err) {
            toast.error('Gửi đánh giá thất bại: ' + err.message);
        }
        setLoading(false);
    };

    const handleEditFeedback = async (feedbackId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Vui lòng đăng nhập để chỉnh sửa đánh giá');
            return;
        }

        if (!editFeedback.trim() || editRating === 0) {
            toast.error('Vui lòng nhập nội dung đánh giá và chọn số sao');
            return;
        }

        setLoading(true);
        try {
            const res = await axios.put(
                `${backendUrl}/api/feedback/update/${feedbackId}`,
                { feedback: editFeedback, rating: editRating },
                { headers: { token } }
            );

            if (res.data.success) {
                setEditingFeedbackId(null);
                setEditFeedback('');
                setEditRating(0);
                fetchFeedbacks();
                toast.success('Đánh giá đã được cập nhật!');
            } else {
                toast.error(res.data.message);
            }
        } catch (err) {
            toast.error('Chỉnh sửa đánh giá thất bại: ' + err.message);
        }
        setLoading(false);
    };

    const handleDeleteFeedback = async (feedbackId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Vui lòng đăng nhập để xóa đánh giá');
            return;
        }

        setLoading(true);
        try {
            const res = await axios.delete(`${backendUrl}/api/feedback/delete/${feedbackId}`, {
                headers: { token },
            });

            if (res.data.success) {
                fetchFeedbacks();
                toast.success('Đánh giá đã được xóa!');
            } else {
                toast.error(res.data.message);
            }
        } catch (err) {
            toast.error('Xóa đánh giá thất bại: ' + err.message);
        }
        setLoading(false);
    }

    const checkUserPurchased = async () => {
        const token = localStorage.getItem('token');
        if (!token || !productId) return;

        try {
            const res = await axios.get(`${backendUrl}/api/order/purchased/${productId}`, {
                headers: { token },
            });
            setCanReview(res.data.purchased);
        } catch (error) {
            console.error('Lỗi kiểm tra quyền gửi đánh giá:', error);
            setCanReview(false);
        }
    };

    useEffect(() => {
        fetchFeedbacks();
        checkUserPurchased();
    }, [productId, page]);

    return (
        <div className="flex flex-col gap-8">
            {/* Form đánh giá */}
            {/* <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Chia sẻ đánh giá của bạn</h3>
                <div className="flex items-center gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                            key={star}
                            className={`w-8 h-8 cursor-pointer transition-colors ${star <= rating ? 'text-yellow-400' : 'text-gray-300'
                                } hover:text-yellow-300`}
                            onClick={() => setRating(star)}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3 .921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784 .57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81 .588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    ))}
                </div>
                <textarea
                    rows="4"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full border border-gray-200 p-3 rounded-lg resize-none text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#EE4D2D] transition"
                    placeholder="Hãy cho chúng tôi biết cảm nhận của bạn về sản phẩm..."
                ></textarea>
                <button
                    onClick={handleCommentSubmit}
                    disabled={loading}
                    className={`mt-4 bg-[#EE4D2D] text-white py-2 px-6 rounded-lg hover:bg-orange-600 text-sm font-medium transition ${loading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                >
                    {loading ? 'Đang gửi...' : 'Gửi đánh giá'}
                </button>
            </div> */}


            {canReview && (
                <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Chia sẻ đánh giá của bạn</h3>
                    <div className="flex items-center gap-2 mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                                key={star}
                                className={`w-8 h-8 cursor-pointer transition-colors ${star <= rating ? 'text-yellow-400' : 'text-gray-300'
                                    } hover:text-yellow-300`}
                                onClick={() => setRating(star)}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3 .921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784 .57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81 .588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        ))}
                    </div>
                    <textarea
                        rows="4"
                        value={newFeedback}
                        onChange={(e) => setNewFeedback(e.target.value)}
                        className="w-full border border-gray-200 p-3 rounded-lg resize-none text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#EE4D2D] transition"
                        placeholder="Hãy cho chúng tôi biết cảm nhận của bạn về sản phẩm..."
                    ></textarea>
                    <button
                        onClick={handleFeedbackSubmit}
                        disabled={loading}
                        className={`mt-4 bg-[#EE4D2D] text-white py-2 px-6 rounded-lg hover:bg-orange-600 text-sm font-medium transition ${loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                    >
                        {loading ? 'Đang gửi...' : 'Gửi đánh giá'}
                    </button>
                </div>
            )}

            {!canReview && (
                <div className="text-gray-500 italic">
                    Bạn cần mua sản phẩm này để gửi đánh giá.
                </div>
            )}



            {/* Danh sách đánh giá */}
            <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Đánh giá từ khách hàng</h3>
                {listLoading ? (
                    <div className="text-center py-8">Đang tải...</div>
                ) : feedbacks.length > 0 ? (
                    <div className="space-y-6">
                        {feedbacks.map((fb) => (
                            <div key={fb._id} className="flex gap-4 p-4 bg-gray-50 rounded-lg shadow-sm">
                                <img
                                    src={fb.userId?.avatar || 'https://via.placeholder.com/40'}
                                    alt="Avatar"
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div className="flex-1">
                                    {editingFeedbackId === fb._id ? (
                                        <div className="bg-white p-4 rounded-lg border">
                                            <div className="flex items-center gap-2 mb-3">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <svg
                                                        key={star}
                                                        className={`w-6 h-6 cursor-pointer ${star <= editRating ? 'text-yellow-400' : 'text-gray-300'
                                                            } hover:text-yellow-300`}
                                                        onClick={() => setEditRating(star)}
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3 .921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784 .57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81 .588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                ))}
                                            </div>
                                            <textarea
                                                rows="3"
                                                value={editFeedback}
                                                onChange={(e) => setEditFeedback(e.target.value)}
                                                className="w-full border border-gray-200 p-2 rounded-lg resize-none text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#EE4D2D]"
                                                placeholder="Chỉnh sửa phản hồi..."
                                            ></textarea>
                                            <div className="flex gap-2 mt-3">
                                                <button
                                                    onClick={() => handleEditFeedback(fb._id)}
                                                    disabled={loading}
                                                    className={`bg-[#EE4D2D] text-white py-1 px-4 rounded hover:bg-orange-600 text-sm ${loading ? 'opacity-50 cursor-not-allowed' : ''
                                                        }`}
                                                >
                                                    {loading ? 'Đang lưu...' : 'Lưu'}
                                                </button>
                                                <button
                                                    onClick={() => setEditingFeedbackId(null)}
                                                    className="bg-gray-200 text-gray-700 py-1 px-4 rounded hover:bg-gray-300 text-sm"
                                                >
                                                    Hủy
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-gray-800">{fb.userId?.name || 'Khách'}</span>
                                                    <div className="flex items-center gap-1">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <svg
                                                                key={star}
                                                                className={`w-5 h-5 ${star <= fb.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                                                fill="currentColor"
                                                                viewBox="0 0 20 20"
                                                            >
                                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3 .921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784 .57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81 .588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                            </svg>
                                                        ))}
                                                    </div>
                                                </div>
                                                {fb.userId?._id === currentUserId && (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => {
                                                                setEditingFeedbackId(fb._id);
                                                                setEditFeedback(fb.feedback);
                                                                setEditRating(fb.rating);
                                                            }}
                                                            className="text-blue-600 hover:text-blue-800 text-sm"
                                                        >
                                                            Chỉnh sửa
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                handleDeleteFeedback(fb._id);
                                                            }}
                                                            className="text-red-600 hover:text-red-800 text-sm"
                                                        >
                                                            Xóa
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {new Date(fb.createdAt).toLocaleString('vi-VN', {
                                                    year: 'numeric',
                                                    month: '2-digit',
                                                    day: '2-digit',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    hour12: false,
                                                })}
                                            </p>
                                            <p className="text-gray-600 mt-2">{fb.feedback}</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">Chưa có phản hồi nào. Hãy là người đầu tiên chia sẻ cảm nhận!</p>
                )}
            </div>

           
            {/* <div className="flex justify-center gap-3 mt-6">
                <button
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-gray-200 rounded-lg text-sm disabled:opacity-50"
                >
                    Trước
                </button>
                <span className="text-sm text-gray-600">
                    Trang {page} / {totalPages}
                </span>
                <button
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={page === totalPages}
                    className="px-4 py-2 bg-gray-200 rounded-lg text-sm disabled:opacity-50"
                >
                    Sau
                </button>
            </div> */}

            {totalPages > 1 && (
                <div className="flex justify-center gap-3 mt-6">
                    <button
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        disabled={page === 1}
                        className="px-4 py-2 bg-gray-200 rounded-lg text-sm disabled:opacity-50"
                    >
                        Trang Trước
                    </button>
                    <span className="text-sm text-gray-600">
                        Trang {page} / {totalPages}
                    </span>
                    <button
                        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={page === totalPages}
                        className="px-4 py-2 bg-gray-200 rounded-lg text-sm disabled:opacity-50"
                    >
                        Trang Sau
                    </button>
                </div>
            )}

        </div>

    );
};

export default ProductFeedback;