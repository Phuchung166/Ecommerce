import express from 'express';
import cors from 'cors';
// import 'dotenv/config'
import dotenv from 'dotenv';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import feedbackRouter from './routes/feedbackRoute.js';

// App Config
dotenv.config();
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// Middleware
app.use(cors());
app.use(express.json());

// api endpoints
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)
app.use('/api/feedback', feedbackRouter);
 
app.get('/', (req, res) => {
    res.send("API working")
})

app.listen(port, () => console.log('Server started on PORT : ' + port));
