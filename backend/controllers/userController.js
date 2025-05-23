import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import userModel from "../models/userModel.js";
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { promisify } from 'util';


const unlinkAsync = promisify(fs.unlink);

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
}

// Route for user login
const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!email || !password) {
            return res.json({ success: false, message: "Vui lòng nhập đầy đủ email và mật khẩu" });
        }

        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "Tài khoản không tồn tại" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {

            const token = createToken(user._id)
            res.json({ success: true, token });

        }
        else {
            return res.json({ success: false, message: "Sai mật khẩu" });
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Route for user register
const registerUser = async (req, res) => {
    try {

        const { name, email, password } = req.body;

        // Validate data
        if (!name || !email || !password) {
            return res.json({ success: false, message: "Vui lòng nhập đầy đủ các trường" });
        }

        // Check user already exists or not
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "Người dùng đã tồn tại" });
        }

        // validating email format & strong password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Vui lòng nhập email hợp lệ" })
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Mật khẩu phải ít nhất 8 kí tự" })
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Create new user 
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        })

        // Save to database
        const user = await newUser.save()

        const token = createToken(user._id)

        res.json({ success: true, token })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }

}

// Route for admin login
const adminLogin = async (req, res) => {
    try {

        const { email, password } = req.body

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET)
            // const token = jwt.sign({email, role: 'admin'}, process.env.JWT_SECRET)

            res.json({ success: true, token })
        }
        else {
            res.json({ success: false, message: "Thông tin xác thực không hợp lệ" })
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Lấy thông tin user hiện tại
const getUserProfile = async (req, res) => {
    try {

        const userId = req.user.id; // Lấy từ middleware authUser
        const user = await userModel.findById(userId)
        if (!user) {
            return res.json({ success: false, message: 'Không tìm thấy người dùng' });
        }
        res.json({ success: true, user });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Cập nhật profile
const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user?.id; // Lấy từ middleware authUser
        if (!userId) {
            return res.json({ success: false, message: 'User ID not provided' });
        }

        const { name, email, password } = req.body;
        let avatar = req.body.avatar;

        // Nếu có file upload (trường hợp cập nhật avatar)
        if (req.file) {
            try {
                // console.log('Uploading file to Cloudinary:', req.file.path);
                const result = await cloudinary.uploader.upload(req.file.path, {
                    folder: 'user_avatars',
                    resource_type: 'image',
                });
                // console.log('Cloudinary upload result:', result);
                avatar = result.secure_url;
                // Xóa file tạm
                await unlinkAsync(req.file.path);
            } catch (uploadError) {
                console.error('Cloudinary upload error:', uploadError);
                return res.json({ success: false, message: 'Failed to upload avatar to Cloudinary' });
            }
        }


        const updateData = {};
        if (name) updateData.name = name;
        if (email) {
            // Validate email format
            if (!validator.isEmail(email)) {
                return res.json({ success: false, message: 'Vui lòng nhập email hợp lệ' });
            }
            updateData.email = email;
        }
        if (avatar) {
            // console.log('Setting avatar URL:', avatar);
            updateData.avatar = avatar;
        }
        if (password) {
            if (password.length < 8) {
                return res.json({ success: false, message: 'Mật khẩu phải ít nhất 8 kí tự' });
            }
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        // Kiểm tra xem có dữ liệu để cập nhật không
        if (Object.keys(updateData).length === 0) {
            return res.json({ success: false, message: 'Không có dữ liệu để cập nhật' });
        }

        // console.log('Updating user with data:', updateData);
        const user = await userModel.findByIdAndUpdate(userId, updateData, {
            new: true,
            select: '-password -cartData',
        });

        if (!user) {
            return res.json({ success: false, message: 'Không tìm thấy người dùng' });
        }
        // console.log('Updated user:', user);
        res.json({ success: true, user, message: 'Hồ sơ được cập nhật thành công' });
    } catch (error) {
        console.error('Update profile error:', error);
        res.json({ success: false, message: error.message });
    }
};

// Lấy danh sách người dùng
const getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 15;
        const skip = (page - 1) * limit;

        // Xây dựng query lọc (nếu cần tìm kiếm theo email hoặc tên)
        const query = {};
        if (req.query.search) {
            query.$or = [
                { name: { $regex: req.query.search, $options: 'i' } },
                { email: { $regex: req.query.search, $options: 'i' } },
            ];
        }

        // Đếm tổng số người dùng
        const total = await userModel.countDocuments(query);

        // Lấy người dùng theo trang
        const users = await userModel
            // .find(query, 'name email role')
            .find(query, 'name email avatar')
            .skip(skip)
            .limit(limit)
            .lean();

        res.json({
            success: true,
            users,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error('Get all users error:', error);
        res.json({ success: false, message: error.message });
    }
};

// Cập nhật thông tin người dùng
const updateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { name, email} = req.body;

        // Validate input
        if (!userId || !name || !email ) {
            return res.json({ success: false, message: 'Vui lòng cung cấp đầy đủ thông tin' });
        }
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: 'Email không hợp lệ' });
        }
        // if (!['Admin', 'User'].includes(role)) {
        //     return res.json({ success: false, message: 'Vai trò không hợp lệ' });
        // }

        const user = await userModel.findByIdAndUpdate(
            userId,
            { name, email},
            { new: true, select: 'name email avatar' }
        );

        if (!user) {
            return res.json({ success: false, message: 'Không tìm thấy người dùng' });
        }

        res.json({ success: true, user, message: 'Cập nhật người dùng thành công' });
    } catch (error) {
        console.error('Update user error:', error);
        res.json({ success: false, message: error.message });
    }
};

// Xóa người dùng
const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await userModel.findByIdAndDelete(userId);

        if (!user) {
            return res.json({ success: false, message: 'Không tìm thấy người dùng' });
        }

        res.json({ success: true, message: 'Xóa người dùng thành công' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.json({ success: false, message: error.message });
    }
};


export { loginUser, registerUser, adminLogin, getUserProfile, updateUserProfile, getAllUsers, updateUser, deleteUser };