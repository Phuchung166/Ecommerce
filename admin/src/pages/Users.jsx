import React, { useState, useEffect } from 'react';
import axios from 'axios';
import validator from 'validator';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { backendUrl } from '../App';

const Users = ({ token }) => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [editUser, setEditUser] = useState(null);
    const [editData, setEditData] = useState({ id: null, name: '', email: '' });
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [limit] = useState(20);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');

    // Lấy danh sách người dùng
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${backendUrl}/api/user/all`, {
                headers: { token },
                params: { page, limit, search },
            });
            if (response.data.success) {
                setUsers(response.data.users);
                setTotalPages(response.data.totalPages);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error('Fetch users error:', error);
            toast.error(error.response?.data?.message || 'Lỗi khi tải danh sách người dùng');
            if (error.response?.status === 401 || error.response?.status === 403) {
                navigate('/admin');
            }
        } finally {
            setLoading(false);
        }
    };

    // Gọi API khi page hoặc token thay đổi
    useEffect(() => {
        if (token) {
            fetchUsers();
        } else {
            toast.error('Vui lòng đăng nhập với quyền admin');
            navigate('/admin');
        }
    }, [token, page, search, navigate]);

    // Mở modal chỉnh sửa
    const openEditModal = (user) => {
        setEditUser(user._id);
        setEditData({ id: user._id, name: user.name, email: user.email });
    };

    // Xử lý thay đổi input trong modal
    const handleEditChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    // Lưu chỉnh sửa
    const saveEdit = async () => {
        if (!validator.isEmail(editData.email)) {
            toast.error('Email không hợp lệ');
            return;
        }
        try {
            const response = await axios.put(
                `${backendUrl}/api/user/edit/${editData.id}`,
                { name: editData.name, email: editData.email },
                { headers: { token } }
            );
            if (response.data.success) {
                setUsers(users.map((user) => (user._id === editData.id ? response.data.user : user)));
                setEditUser(null);
                toast.success('Cập nhật người dùng thành công');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error('Save edit error:', error);
            toast.error(error.response?.data?.message || 'Lỗi khi cập nhật người dùng');
        }
    };

    // Đóng modal chỉnh sửa
    const closeEditModal = () => {
        setEditUser(null);
    };

    // Xác nhận xóa
    const confirmDelete = (id) => {
        setDeleteConfirm(id);
    };

    // Xóa người dùng
    const deleteUser = async (id) => {
        try {
            const response = await axios.delete(`${backendUrl}/api/user/delete/${id}`, {
                headers: { token },
            });
            if (response.data.success) {
                setUsers(users.filter((user) => user._id !== id));
                setDeleteConfirm(null);
                toast.success('Xóa người dùng thành công');
                if (users.length === 1 && page > 1) {
                    setPage(page - 1);
                } else {
                    fetchUsers();
                }
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error('Delete user error:', error);
            toast.error(error.response?.data?.message || 'Lỗi khi xóa người dùng');
        }
    };

    // Hủy xóa
    const cancelDelete = () => {
        setDeleteConfirm(null);
    };

    // Xử lý chuyển trang
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    // Xử lý tìm kiếm
    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setPage(1); // Reset về trang 1 khi tìm kiếm
    };

    return (
        <div className="max-w-4xl mx-auto  min-h-screen">
            <h2 className="text-2xl font-semibold mb-4">User management </h2>
            <div className="mb-4">
                <input
                    type="text"
                    value={search}
                    onChange={handleSearchChange}
                    placeholder="Tìm kiếm theo tên hoặc email"
                    className="w-full max-w-md px-3 py-2 border border-gray-300 rounded"
                />
            </div>
            {loading ? (
                <div className="text-center py-8">Đang tải...</div>
            ) : users.length === 0 ? (
                <div className="text-center py-8">Không tìm thấy người dùng</div>
            ) : (
                <div className="overflow-x-auto max-h-[70vh]">
                    <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                        <thead className="bg-gray-200 text-gray-700 sticky top-0 z-10">
                            <tr>
                                <th className="px-4 py-2 text-left">Avatar</th>
                                <th className="px-4 py-2 text-left">Name</th>
                                <th className="px-4 py-2 text-left">Email</th>
                                <th className="px-4 py-2 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id} className="border-t">
                                    <td className="px-4 py-2">
                                        <img
                                            src={user.avatar || 'https://via.placeholder.com/40'}
                                            alt={user.name}
                                            className="w-12 h-12 object-cover rounded-md"
                                        />
                                    </td>
                                    <td className="px-4 py-2">{user.name}</td>
                                    <td className="px-4 py-2">{user.email}</td>
                                    <td className="px-4 py-2 text-center">
                                        <div className="flex gap-2 justify-center">
                                            <button
                                                onClick={() => openEditModal(user)}
                                                className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => confirmDelete(user._id)}
                                                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                                            >
                                                Delete
                                            </button>
                                            
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                    <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                        className="px-4 py-2 mx-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 cursor-pointer"
                    >
                        Trang trước
                    </button>
                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index}
                            onClick={() => handlePageChange(index + 1)}
                            className={`px-4 py-2 mx-1 ${page === index + 1 ? 'bg-pink-300 text-white' : 'bg-gray-200'
                                } rounded hover:bg-pink-200 cursor-pointer`}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages}
                        className="px-4 py-2 mx-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 cursor-pointer"
                    >
                        Trang sau
                    </button>
                </div>
            )}
            {editUser && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h3 className="text-lg font-semibold mb-4">Chỉnh sửa người dùng</h3>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Tên</label>
                            <input
                                type="text"
                                name="name"
                                value={editData.name}
                                onChange={handleEditChange}
                                className="mt-1 block w-full border p-2 rounded text-sm"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={editData.email}
                                onChange={handleEditChange}
                                className="mt-1 block w-full border p-2 rounded text-sm"
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={closeEditModal}
                                className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={saveEdit}
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                            >
                                Lưu
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {deleteConfirm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h3 className="text-lg font-semibold mb-4">Xác nhận xóa</h3>
                        <p>Bạn có chắc chắn muốn xóa người dùng này?</p>
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={cancelDelete}
                                className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={() => deleteUser(deleteConfirm)}
                                className="bg-pink-300 text-white px-4 py-2 rounded hover:bg-pink-400"
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

export default Users;