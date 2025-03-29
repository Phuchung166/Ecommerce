import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import userModel from "../models/userModel.js";


const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
}

// Route for user login
const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Vui lòng nhập đầy đủ email và mật khẩu" });
        }

        const user = await userModel.findOne({ email })

        if (!user) {
            return res.status(400).json({ success: false, message: "Tài khoản không tồn tại" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {

            const token = createToken(user._id)
            res.json({ success: true, token });

        }
        else {
            return res.status(400).json({ success: false, message: "Sai mật khẩu" });
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

        // // Validate data
        // if (!name || !email || !password) {
        //     return res.status(400).json({ msg: "Please fill all fields" });
        // }

        // Check user already exists or not
        const exists = await userModel.findOne({ email });
        if (exists) {
            // return res.json({ success: false, message: "Người dùng đã tồn tại" })
            return res.status(400).json({ success: false, message: "Người dùng đã tồn tại" });
        }

        // validating email format & strong password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
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


export { loginUser, registerUser, adminLogin };