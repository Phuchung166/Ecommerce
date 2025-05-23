import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { backendUrl } from '../App';


const clientBaseUrl = import.meta.env.VITE_FRONTEND_URL
const Feedbacks = ({ token }) => {
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchInput, setSearchInput] = useState(''); // Giá trị ô nhập
  const [searchQuery, setSearchQuery] = useState(''); // Giá trị tìm kiếm 
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const userId = urlParams.get('userId');
      const response = await axios.get(`${backendUrl}/api/feedback/all`, {
        headers: { token },
        params: { page, limit, search: searchQuery, userId },
      });
      if (response.data.success) {
        setFeedbacks(response.data.feedbacks);
        setTotal(response.data.total);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi khi tải danh sách phản hồi');
      if (error.response?.status === 401 || error.response?.status === 403) {
        navigate('/admin');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (feedbackId) => {
    try {
      const response = await axios.delete(`${backendUrl}/api/feedback/admin/delete/${feedbackId}`, {
        headers: { token },
      });
      if (response.data.success) {
        toast.success('Xóa phản hồi thành công');
        fetchFeedbacks();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi khi xóa phản hồi');
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearch = () => {
    setSearchQuery(searchInput); // Cập nhật searchQuery khi nhấn Search
    setPage(1); // Reset về trang 1
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
      fetchFeedbacks();
    } else {
      toast.error('Vui lòng đăng nhập với quyền admin');
      navigate('/admin');
    }
  }, [token, page, searchQuery, navigate]);

  return (
    <div className="p max-w-4xl mx-auto  min-h-screen">
      <h2 className="text-2xl font-semibold mb-4">Quản Lý Phản Hồi</h2>
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={searchInput}
          onChange={handleSearchInputChange}
          placeholder="Tìm kiếm theo tên sản phẩm, tên hoặc email người dùng..."
          className="w-full max-w-md px-3 py-2 border border-gray-300 rounded"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Tìm kiếm
        </button>
      </div>
      {loading ? (
        <div className="text-center py-8">Đang tải...</div>
      ) : feedbacks.length === 0 ? (
        <div className="text-center py-8">Không tìm thấy phản hồi</div>
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
                  <th className="px-4 py-2 text-left">Thời Gian</th>
                  <th className="px-4 py-2 text-center">Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {feedbacks.map((feedback) => (
                  <tr key={feedback._id} className="border-t">
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={feedback.userId?.avatar || 'https://via.placeholder.com/40'}
                          alt={feedback.userId?.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <p>{feedback.userId?.name || 'N/A'}</p>
                          <p className="text-sm text-gray-600">{feedback.userId?.email || 'N/A'}</p>
                        </div>
                      </div>
                    </td>
                    {/* <td className="px-4 py-2">{feedback.productId?.name || 'N/A'}</td> */}
                    <td className="px-4 py-2">
                      <a
                        href={`${clientBaseUrl}/product/${feedback.productId?._id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {feedback.productId?.name || 'N/A'}
                      </a>
                    </td>
                    <td className="px-4 py-2">{feedback.feedback}</td>
                    <td className="px-4 py-2">{feedback.rating}/5</td>
                    <td className="px-4 py-2 text-sm text-gray-600">
                      {new Date(feedback.createdAt).toLocaleString('vi-VN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                      })}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => setDeleteConfirm(feedback._id)}
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
            {feedbacks.map((feedback) => (
              <div key={feedback._id} className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex items-center gap-4">
                  <img
                    src={feedback.userId?.avatar || 'https://via.placeholder.com/40'}
                    alt={feedback.userId?.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{feedback.userId?.name || 'N/A'}</p>
                    <p className="text-sm text-gray-600">{feedback.userId?.email || 'N/A'}</p>
                  </div>
                </div>
                <p className="mt-2">Sản phẩm: {feedback.productId?.name || 'N/A'}</p>
                <p>Nội dung: {feedback.feedback}</p>
                <p>Điểm: {feedback.rating}/5</p>
                <button
                  onClick={() => setDeleteConfirm(feedback._id)}
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
                  className={`px-4 py-2 mx-1 ${page === pageNum ? 'bg-pink-500 text-white' : 'bg-gray-200'
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
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Xác Nhận Xóa</h3>
            <p>Bạn có chắc chắn muốn xóa phản hồi này?</p>
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

export default Feedbacks;