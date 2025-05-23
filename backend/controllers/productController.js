import { v2 as cloudinary } from 'cloudinary'
import productModel from '../models/productModel.js'

// function for add product
const addProduct = async (req, res) => {
    try {

        const { name, description, price, category, subCategory, sizes, bestseller } = req.body

        if (!name || !price || !category || !subCategory || !sizes) {
            return res.json({ success: false, message: ' Vui lòng nhập đầy đủ Tên, giá, danh mục và kích thước' });
        }

        const parsedPrice = Number(price);
        if (isNaN(parsedPrice) || parsedPrice <= 0) {
            return res.json({ success: false, message: 'Giá tiền phải là một số dương' });
        }

        // Xác thực sizes
        let parsedSizes;
        try {
            parsedSizes = JSON.parse(sizes);
            if (!Array.isArray(parsedSizes) || parsedSizes.length === 0) {
                return res.json({ success: false, message: 'Vui lòng chọn kích thước' });
            }
        } catch (error) {
            return res.status(400).json({ success: false, message: 'Định dạng kích thước không hợp lệ.' });
        }

        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined);
        if (!images.length) {
            return res.json({
                success: false, message: 'Thêm ảnh sản phẩm'
            });
        }

        let imageUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                return result.secure_url;
            })
        )

        const productData = {
            name,
            description,
            // price: Number(price),
            price: parsedPrice,
            category,
            subCategory,
            bestseller: bestseller === "true" ? true : false,
            // sizes: JSON.parse(sizes),
            sizes: parsedSizes,
            image: imageUrl,
            date: Date.now()
        }

        console.log(productData);

        const product = new productModel(productData);
        await product.save();


        res.json({ success: true, message: "Product Added" })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }

}

// function for list product
const listProduct = async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        // Xây dựng query lọc
        const query = {};
        if (req.query.category) {
            query.category = { $in: req.query.category.split(',') }; // Hỗ trợ nhiều category
        }
        if (req.query.subCategory) {
            query.subCategory = { $in: req.query.subCategory.split(',') }; // Hỗ trợ nhiều subCategory
        }
        if (req.query.search) {
            query.name = { $regex: req.query.search, $options: 'i' }; // Tìm kiếm không phân biệt hoa thường
        }

        // Đếm tổng số sản phẩm phù hợp
        const total = await productModel.countDocuments(query);

        // Lấy sản phẩm theo trang
        let products = await productModel
            .find(query)
            .skip(skip)
            .limit(limit)
            .lean(); // .lean() để tăng hiệu suất


        // Xử lý sắp xếp nếu có
        const sortType = req.query.sortType;
        if (sortType === 'low-high') {
            products = products.sort((a, b) => a.price - b.price);
        } else if (sortType === 'high-low') {
            products = products.sort((a, b) => b.price - a.price);
        }

        // const products = await productModel.find({});
        res.json({ success: true, products, total, page, limit, totalPages: Math.ceil(total / limit) });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// function for removing product
const removeProduct = async (req, res) => {
    try {
        const productId = req.body.id
        await productModel.findByIdAndDelete(productId)
        res.json({ success: true, message: "Product Removed" })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// function for single product info
const singleProduct = async (req, res) => {
    try {

        const { productId } = req.body
        const product = await productModel.findById(productId)
        res.json({ success: true, product });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}


// function for edit product
const editProduct = async (req, res) => {
    try {
        const { id, name, description, price, category, subCategory, sizes, bestseller } = req.body;

        // Xác thực trường bắt buộc
        if (!id || !name || !price || !category || !subCategory || !sizes) {
            return res.json({
                success: false,
                message: 'Vui lòng nhập đầy đủ ID, tên, giá, danh mục và kích thước',
            });
        }

        // Xác thực giá tiền
        const parsedPrice = Number(price);
        if (isNaN(parsedPrice) || parsedPrice <= 0) {
            return res.json({
                success: false,
                message: 'Giá tiền phải là một số dương',
            });
        }

        // Xác thực sizes
        let parsedSizes;
        try {
            parsedSizes = JSON.parse(sizes);
            if (!Array.isArray(parsedSizes) || parsedSizes.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Vui lòng chọn kích thước',
                });
            }
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: 'Định dạng kích thước không hợp lệ.',
            });
        }

        // Xử lý hình ảnh
        const images = ['image1', 'image2', 'image3', 'image4']
            .map((key) => req.files?.[key]?.[0])
            .filter(Boolean);

        let imageUrls = [];
        if (images.length > 0) {
            // Tải hình ảnh mới lên Cloudinary
            imageUrls = await Promise.all(
                images.map(async (item) => {
                    try {
                        const result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                        return result.secure_url;
                    } catch (uploadError) {
                        console.error(`Lỗi tải ảnh: ${uploadError.message}`);
                        return null;
                    }
                })
            ).then((urls) => urls.filter(Boolean));

            if (!imageUrls.length) {
                return res.status(500).json({
                    success: false,
                    message: 'Không thể tải ảnh sản phẩm. Vui lòng thử lại.',
                });
            }
        }

        // Tạo dữ liệu cập nhật
        const updateData = {
            name,
            description: description || '',
            price: parsedPrice,
            category,
            subCategory,
            bestseller: bestseller === 'true' || bestseller === true,
            sizes: parsedSizes,
            date: Date.now(),
        };

        // Nếu có hình ảnh mới, cập nhật trường image
        if (imageUrls.length > 0) {
            updateData.image = imageUrls;
        }

        // Cập nhật sản phẩm trong database
        const product = await productModel.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });

        if (!product) {
            return res.json({ success: false, message: 'Không tìm thấy sản phẩm',});
        }

        res.json({success: true, message: 'Sản phẩm đã được cập nhật thành công', product,});
    } catch (error) {
        console.error('Lỗi khi sửa sản phẩm:', error);
        res.json({success: false, message: 'Lỗi server. Vui lòng thử lại sau.',});
    }
};


export { listProduct, addProduct, removeProduct, singleProduct, editProduct }
