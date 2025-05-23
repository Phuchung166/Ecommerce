import React, { useState, useEffect, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
    const { backendUrl } = useContext(ShopContext);
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isEditingAvatar, setIsEditingAvatar] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [loading, setLoading] = useState(false);

    // Lấy thông tin user
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchUserProfile = async () => {
            try {
                const res = await axios.get(`${backendUrl}/api/user/me`, {
                    headers: { token }
                });
                if (res.data.success) {
                    setUser(res.data.user);
                    setName(res.data.user.name);
                    setEmail(res.data.user.email);
                }
            } catch (err) {
                console.error('Error fetching profile:', err);
                toast.error('Không thể tải thông tin profile');
            }
        };

        fetchUserProfile();
    }, [backendUrl, navigate]);

    // Xử lý upload file avatar
    const onChangeHandler = (e) => {
        const file = e.target.files?.[0];
        // if (file) setProfilePhoto(file);
        if (file) {
            setProfilePhoto(file);
            // setAvatarPreview(URL.createObjectURL(file));
        }
    };

    // Cập nhật avatar
    const updateAvatarHandler = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Vui lòng đăng nhập lại');
            return;
        }

        if (!profilePhoto) {
            toast.error('Vui lòng chọn ảnh');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('avatar', profilePhoto);
            formData.append('userId', user._id); // Thêm userId

            const res = await axios.put(`${backendUrl}/api/user/update`, formData, {
                headers: { token, 'Content-Type': 'multipart/form-data' }
            });

            // const res = await axios.put(`${backendUrl}/api/user/update`, formData, {
            //     headers: { token }
            // });

            if (res.data.success) {
                setUser(res.data.user);
                setIsEditingAvatar(false);
                setProfilePhoto(null);
                toast.success(res.data.message || 'Đã cập nhật ảnh đại diện');
            } else {
                toast.error(res.data.message);
            }
        } catch (err) {
            console.error('Avatar update error:', err);
            toast.error('Cập nhật ảnh đại diện thất bại: ' + err.message);
        }
        setLoading(false);
    };

    // Cập nhật profile
    const updateProfileHandler = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Vui lòng đăng nhập lại');
            return;
        }

        setLoading(true);
        try {
            // const res = await axios.put(`${backendUrl}/api/user/update`, {
            //     name,
            //     email,
            //     password
            // }, {
            //     headers: { token }
            // });

            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            if (password) formData.append('password', password);
      
            const res = await axios.put(`${backendUrl}/api/user/update`, formData, {
              headers: { token, 'Content-Type': 'multipart/form-data' },
            });
            
            if (res.data.success) {
                setUser(res.data.user);
                setIsEditingProfile(false);
                setPassword('');
                toast.success(res.data.message || 'Đã cập nhật hồ sơ');
            } else {
                toast.error(res.data.message);
            }
        } catch (err) {
            toast.error('Cập nhật hồ sơ thất bại: ' + err.message);
        }
        setLoading(false);
    };

    if (!user) {
        return <div className="text-center py-10">Đang tải...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto px-4 my-10 animate-fadeIn">
            <ToastContainer />
            {/* Header Section */}
            <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className="relative">
                    <img
                        src={user.avatar || 'https://via.placeholder.com/40'}
                        alt="Avatar"
                        className="w-24 h-24 rounded-full object-cover"
                    />
                    <button
                        onClick={() => setIsEditingAvatar(true)}
                        className="absolute bottom-0 right-0 bg-[#EE4D2D] text-white p-2 rounded-full hover:bg-orange-600 transition"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                        </svg>
                    </button>
                </div>
                <div className="text-center md:text-left">
                    <h1 className="font-semibold text-2xl text-gray-900">{user.name}</h1>
                    <p className="text-gray-600 mt-1">{user.email}</p>
                    <button
                        onClick={() => setIsEditingProfile(true)}
                        className="mt-4 bg-[#EE4D2D] text-white py-2 px-6 rounded-lg hover:bg-orange-600 text-sm font-medium transition"
                    >
                        Sửa hồ sơ
                    </button>
                </div>
            </div>

            {/* Thông Tin Cá Nhân */}
            {/* <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Thông tin cá nhân</h3>
                <div className="flex flex-col gap-4 text-gray-600">
                    <p>
                        <strong>Tên:</strong> {user.name}
                    </p>
                    <p>
                        <strong>Email:</strong> {user.email}
                    </p>
                </div>
            </div> */}

            {/* Modal Cập Nhật Ảnh */}
            {isEditingAvatar && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md transform transition-all duration-300 scale-100 opacity-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Cập nhật ảnh đại diện</h3>
                        <form onSubmit={updateAvatarHandler} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Chọn ảnh</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={onChangeHandler}
                                    className="mt-1 w-full border border-gray-200 p-2 rounded-lg text-gray-700"
                                />
                            </div>
                            <div className="flex gap-4 mt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`bg-[#EE4D2D] text-white py-2 px-6 rounded-lg hover:bg-orange-600 text-sm font-medium transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {loading ? 'Đang lưu...' : 'Lưu'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditingAvatar(false);
                                        setProfilePhoto(null);
                                    }}
                                    className="bg-gray-200 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-300 text-sm font-medium"
                                >
                                    Hủy
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Sửa Hồ Sơ */}
            {isEditingProfile && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md transform transition-all duration-300 scale-100 opacity-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Sửa hồ sơ</h3>
                        <form onSubmit={updateProfileHandler} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tên</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Nhập tên của bạn"
                                    className="mt-1 w-full border border-gray-200 p-2 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#EE4D2D]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Nhập email của bạn"
                                    className="mt-1 w-full border border-gray-200 p-2 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#EE4D2D]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Mật khẩu mới (tùy chọn)</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Nhập mật khẩu mới"
                                    className="mt-1 w-full border border-gray-200 p-2 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#EE4D2D]"
                                />
                            </div>
                            <div className="flex gap-4 mt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`bg-[#EE4D2D] text-white py-2 px-6 rounded-lg hover:bg-orange-600 text-sm font-medium transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {loading ? 'Đang lưu...' : 'Lưu'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditingProfile(false);
                                        setPassword('');
                                    }}
                                    className="bg-gray-200 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-300 text-sm font-medium"
                                >
                                    Hủy
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;