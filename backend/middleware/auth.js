import jwt from 'jsonwebtoken'

const authUser = async (req, res, next) => {

    const { token } = req.headers

    if (!token) {
        return res.json({ success: false, message: 'Not Authorized Login Again' })
    }

    try {

        const token_decode = jwt.verify(token, process.env.JWT_SECRET)
        // req.body.userId = token_decode.id
        req.user = { id: token_decode.id }; // Gán userId vào req.user
        next()

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }

}

export default authUser

// import jwt from 'jsonwebtoken';

// const authUser = async (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.json({ success: false, message: 'Not Authorized. Please Login Again' });
//   }

//   try {
//     const token = authHeader.split(' ')[1];
//     const token_decode = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = { id: token_decode.id };
//     next();
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// };

// export default authUser;