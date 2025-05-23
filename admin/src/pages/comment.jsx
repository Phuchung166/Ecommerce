import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { backendUrl } from '../App';

const Feedbacks = ({ token }) => {
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/feedback/all`, {
        headers: { token },
        params: { page, limit, search },
      });
      if (response.data.success) {
        setComments(response.data.comments);
        setTotal(response.data.total);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi khi tải danh sách đánh giá');
      if (error.response?.status === 401 || error.response?.status === 403) {
        navigate('/admin');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      const response = await axios.delete(`${backendUrl}/api/feedback/delete/${commentId}`, {
        headers: { token },
      });
      if (response.data.success) {
        toast.success('Xóa đánh giá thành công');
        fetchComments();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi khi xóa đánh giá');
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= Math.ceil(total / limit)) {
      setPage(newPage);
    }
  };

  const getPaginationButtons = () => {
    const maxButtons = 5;
    const totalPages = Math.ceil(total / limit);
    const buttons = [];
    let startPage = Math.max(1, page - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(i);
    }
    return buttons;
  };

  useEffect(() => {
    if (token) {
      fetchComments();
    } else {
      toast.error('Vui lòng đăng nhập với quyền admin');
      navigate('/admin');
    }
  }, [token, page, search, navigate]);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-semibold mb-4">Quản Lý Đánh Giá</h2>
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Tìm kiếm theo nội dung, người dùng hoặc sản phẩm..."
          className="w-full max-w-md px-3 py-2 border border-gray-300 rounded"
        />
      </div>
      {loading ? (
        <div className="text-center py-8">Đang tải...</div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8">Không tìm thấy đánh giá</div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto max-h-[70vh]">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gray-200 text-gray-700 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-2 text-left">Người Dùng</th>
                  <th className="px-4 py-2 text-left">Sản Phẩm</th>
                  <th className="px-4 py-2 text-left">Nội Dung</th>
                  <th className="px-4 py-2 text-left">Điểm</th>
                  <th className="px-4 py-2 text-center">Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {comments.map((comment) => (
                  <tr key={comment._id} className="border-t">
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={comment.userId?.avatar || 'https://via.placeholder.com/40'}
                          alt={comment.userId?.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <p>{comment.userId?.name || 'N/A'}</p>
                          <p className="text-sm text-gray-600">{comment.userId?.email || 'N/A'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2">{comment.productId?.name || 'N/A'}</td>
                    <td className="px-4 py-2">{comment.comment}</td>
                    <td className="px-4 py-2">{comment.rating}/5</td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => setDeleteConfirm(comment._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Mobile List */}
          <div className="md:hidden space-y-4">
            {comments.map((comment) => (
              <div key={comment._id} className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex items-center gap-4">
                  <img
                    src={comment.userId?.avatar || 'https://via.placeholder.com/40'}
                    alt={comment.userId?.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{comment.userId?.name || 'N/A'}</p>
                    <p className="text-sm text-gray-600">{comment.userId?.email || 'N/A'}</p>
                  </div>
                </div>
                <p className="mt-2">Sản phẩm: {comment.productId?.name || 'N/A'}</p>
                <p>Nội dung: {comment.comment}</p>
                <p>Điểm: {comment.rating}/5</p>
                <button
                  onClick={() => setDeleteConfirm(comment._id)}
                  className="mt-2 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                >
                  Xóa
                </button>
              </div>
            ))}
          </div>
          {/* Pagination */}
          {total > limit && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 mx-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 cursor-pointer"
              >
                Trang Trước
              </button>
              {getPaginationButtons().map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-4 py-2 mx-1 ${
                    page === pageNum ? 'bg-pink-500 text-white' : 'bg-gray-200'
                  } rounded hover:bg-pink-400 cursor-pointer`}
                >
                  {pageNum}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === Math.ceil(total / limit)}
                className="px-4 py-2 mx-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 cursor-pointer"
              >
                Trang Sau
              </button>
            </div>
          )}
        </>
      )}
      {deleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
         organisms
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Xác Nhận Xóa</h3>
            <p>Bạn có chắc chắn muốn xóa đánh giá này?</p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  handleDelete(deleteConfirm);
                  setDeleteConfirm(null);
                }}
                className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Comments;