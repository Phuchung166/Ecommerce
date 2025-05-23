import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// Placing orders using COD method
const placeOrder = async (req, res) => {

    try {

        // const { userId, items, amount, address } = req.body;
        const { items, amount, address } = req.body;
        const userId = req.user.id;

        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod: "COD",
            payment: false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        await userModel.findByIdAndUpdate(userId, { cartData: {} })

        res.json({ success: true, message: "Order Placed" })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }

}

// Placing orders using Stripe method
const placeOrderStripe = async (req, res) => {



}

// Placing orders using Razorpay method
const placeOrderRazorpay = async (req, res) => {

}

// All Orders data for Admin Panel
const allOrders = async (req, res) => {

    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const total = await orderModel.countDocuments();

        const orders = await orderModel
            .find()
            .skip(skip)
            .limit(limit)
            .sort({ date: -1 }) // Sắp xếp theo ngày mới nhất
            .lean();

        res.json({ success: true, orders, total, page, limit, totalPages: Math.ceil(total / limit), })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }

}

// User Order Data for Frontend
const userOrders = async (req, res) => {
    try {

        // const {userId} = req.body
        const userId = req.user.id;

        const orders = await orderModel.find({ userId })
        res.json({ success: true, orders })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Update order status from Admin Panel
const updateStatus = async (req, res) => {
    try {

        const { orderId, status } = req.body

        await orderModel.findByIdAndUpdate(orderId, { status })
        res.json({ success: true, message: 'Status Updated' })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}


const checkUserPurchased = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;

        const hasPurchased = await orderModel.findOne({
            userId,
            'items._id': productId,
            status: 'Delivered', // Chỉ cho phép phản hồi nếu đơn hàng đã giao
        });

        res.json({ success: true, purchased: !!hasPurchased });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export { placeOrder, placeOrderRazorpay, placeOrderStripe, allOrders, userOrders, updateStatus, checkUserPurchased }