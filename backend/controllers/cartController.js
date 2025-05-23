import userModel from "../models/userModel.js"


// add products to user cart
const addToCart = async (req, res) => {

    try {

        // const { userId, itemId, size } = req.body
        const userId = req.user.id
        const { productId, size } = req.body

        const userData = await userModel.findById(userId)
        let cartData = await userData.cartData;

        if (cartData[productId]) {
            if (cartData[productId][size]) {
                cartData[productId][size] += 1
            }
            else {
                cartData[productId][size] = 1
            }
        } else {
            cartData[productId] = {}
            cartData[productId][size] = 1
        }

        await userModel.findByIdAndUpdate(userId, { cartData })

        res.json({ success: true, message: "Added To Cart" })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }

}

// update user cart
const updateCart = async (req, res) => {
    try {

        // const { userId, itemId, size, quantity } = req.body
        const userId = req.user.id
        const { productId, size, quantity } = req.body

        const userData = await userModel.findById(userId)
        let cartData = await userData.cartData

        // cartData[productId][size] = quantity

        if (!cartData[productId]) cartData[productId] = {};

        if (quantity === 0) {
            delete cartData[productId][size];
        } else {
            cartData[productId][size] = quantity;
        }

        // Làm sạch dữ liệu
        cartData = cleanCartData(cartData);

        await userModel.findByIdAndUpdate(userId, { cartData })
        res.json({ success: true, message: "Cart Updated" })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }

}

// remove product from cart data
const removeFromCart = async (req, res) => {

    try {
        const userId = req.user.id
        const { productId, size } = req.body

        const userData = await userModel.findById(userId)
        let cartData = userData.cartData

        if (cartData[productId] && cartData[productId][size]) {
            delete cartData[productId][size]

            if (Object.keys(cartData[productId]).length === 0) {
                delete cartData[productId]
            }

            // Làm sạch dữ liệu
            cartData = cleanCartData(cartData);

            await userModel.findByIdAndUpdate(userId, { cartData })

            res.json({ success: true, message: "Đã xóa sản phẩm khỏi giỏ hàng" })
        } else {
            return res.json({ success: false, message: "Sản phẩm không tồn tại trong giỏ hàng" });
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }

}

function cleanCartData(cartData) {
    for (const productId in cartData) {
        for (const size in cartData[productId]) {
            if (cartData[productId][size] === null || cartData[productId][size] === undefined) {
                delete cartData[productId][size];
            }
        }

        if (Object.keys(cartData[productId]).length === 0) {
            delete cartData[productId];
        }
    }

    return cartData;
}


//get user cart data
const getUserCart = async (req, res) => {

    try {

        const userId = req.user.id

        const userData = await userModel.findById(userId)
        let cartData = await userData.cartData

        res.json({ success: true, cartData })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }

}

export { addToCart, updateCart, getUserCart, removeFromCart }