import jwt from 'jsonwebtoken'

const adminAuth = async (req, res, next) => {
    try {
        const {token} = req.headers
        if(!token) {
            return res.json({ success: false, message: 'Bạn cần đăng nhập để truy cập' })
        }
        const token_decode = jwt.verify(token, process.env.JWT_SECRET)
        if(token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
            return res.json({ success: false, message: 'Token không hợp lệ' })
        }
        next()
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

export default adminAuth


// import jwt from 'jsonwebtoken';

// const authAdmin = (req, res, next) => {
//   const { token } = req.headers;

//   if (!token) {
//     return res.status(401).json({ success: false, message: 'Không có token. Truy cập bị từ chối.' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // Kiểm tra role
//     if (decoded.role !== 'admin') {
//       return res.status(403).json({ success: false, message: 'Bạn không có quyền admin' });
//     }

//     // Lưu lại thông tin admin
//     req.user = decoded; // Có thể là { email, role: 'admin' }

//     next();
//   } catch (error) {
//     return res.status(401).json({ success: false, message: 'Token không hợp lệ' });
//   }
// };

// export default authAdmin;



// import jwt from 'jsonwebtoken';

// const adminAuth = async (req, res, next) => {
//     try {
//         const authHeader = req.headers.authorization;
//         if (!authHeader || !authHeader.startsWith('Bearer ')) {
//             return res.json({ success: false, message: 'Bạn cần đăng nhập để truy cập' });
//         }

//         const token = authHeader.split(' ')[1];
//         const token_decode = jwt.verify(token, process.env.JWT_SECRET);

//         if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
//             return res.json({ success: false, message: 'Token không hợp lệ' })
//         }

//         req.user = { email: process.env.ADMIN_EMAIL }; // Gán thông tin admin        next();
//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: error.message });
//     }
// };

// export default adminAuth;