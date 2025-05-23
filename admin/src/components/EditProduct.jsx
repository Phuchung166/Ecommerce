// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import { backendUrl } from '../App';
// import { toast } from 'react-toastify';

// const EditProduct = ({ productId, token, onClose, onUpdate }) => {
//   const [product, setProduct] = useState({
//     name: '',
//     description: '',
//     price: '',
//     category: '',
//     subCategory: '',
//     sizes: [],
//     bestseller: false,
//     images: [],
//   });
//   const [newImages, setNewImages] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Tải dữ liệu sản phẩm
//   const fetchProduct = async () => {
//     try {
//       const response = await axios.post(
//         `${backendUrl}/api/product/single`,
//         { productId },
//         { headers: { token } }
//       );
//       if (response.data.success) {
//         setProduct({
//           name: response.data.product.name,
//           description: response.data.product.description,
//           price: response.data.product.price,
//           category: response.data.product.category,
//           subCategory: response.data.product.subCategory,
//           sizes: response.data.product.sizes,
//           bestseller: response.data.product.bestseller,
//           images: response.data.product.image,
//         });
//       } else {
//         toast.error(response.data.message);
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error('Không thể tải sản phẩm');
//     }
//   };

//   useEffect(() => {
//     if (productId) {
//       fetchProduct();
//     }
//   }, [productId]);

//   // Xử lý thay đổi input
//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setProduct((prev) => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value,
//     }));
//   };

//   // Xử lý thay đổi sizes
//   const handleSizesChange = (e) => {
//     const sizes = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
//     setProduct((prev) => ({ ...prev, sizes }));
//   };

//   // Xử lý chọn hình ảnh
//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files).slice(0, 4); // Giới hạn 4 ảnh
//     setNewImages(files);
//   };

//   // Gửi yêu cầu chỉnh sửa
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const formData = new FormData();
//       formData.append('id', productId);
//       formData.append('name', product.name);
//       formData.append('description', product.description);
//       formData.append('price', product.price);
//       formData.append('category', product.category);
//       formData.append('subCategory', product.subCategory);
//       formData.append('sizes', JSON.stringify(product.sizes));
//       formData.append('bestseller', product.bestseller);

//       // Thêm hình ảnh mới nếu có
//       newImages.forEach((file, index) => {
//         formData.append(`image${index + 1}`, file);
//       });

//       const response = await axios.post(`${backendUrl}/api/product/edit`, formData, {
//         headers: { token, 'Content-Type': 'multipart/form-data' },
//       });

//       if (response.data.success) {
//         toast.success(response.data.message);
//         onUpdate(); // Cập nhật danh sách
//         onClose(); // Đóng modal
//       } else {
//         toast.error(response.data.message);
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error('Không thể cập nhật sản phẩm');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white p-6 rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
//         <h2 className="text-xl font-semibold mb-4">Chỉnh sửa sản phẩm</h2>
//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label className="block text-sm font-medium">Tên sản phẩm</label>
//             <input
//               type="text"
//               name="name"
//               value={product.name}
//               onChange={handleInputChange}
//               className="w-full border px-3 py-2 rounded"
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-sm font-medium">Mô tả</label>
//             <textarea
//               name="description"
//               value={product.description}
//               onChange={handleInputChange}
//               className="w-full border px-3 py-2 rounded"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-sm font-medium">Giá</label>
//             <input
//               type="number"
//               name="price"
//               value={product.price}
//               onChange={handleInputChange}
//               min="1"
//               className="w-full border px-3 py-2 rounded"
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-sm font-medium">Danh mục</label>
//             <input
//               type="text"
//               name="category"
//               value={product.category}
//               onChange={handleInputChange}
//               className="w-full border px-3 py-2 rounded"
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-sm font-medium">Danh mục phụ</label>
//             <input
//               type="text"
//               name="subCategory"
//               value={product.subCategory}
//               onChange={handleInputChange}
//               className="w-full border px-3 py-2 rounded"
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-sm font-medium">Kích thước (phân cách bằng dấu phẩy)</label>
//             <input
//               type="text"
//               value={product.sizes.join(', ')}
//               onChange={handleSizesChange}
//               className="w-full border px-3 py-2 rounded"
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-sm font-medium">Bestseller</label>
//             <input
//               type="checkbox"
//               name="bestseller"
//               checked={product.bestseller}
//               onChange={handleInputChange}
//               className="h-4 w-4"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-sm font-medium">Hình ảnh hiện tại</label>
//             <div className="flex gap-2">
//               {product.images.map((img, index) => (
//                 <img key={index} src={img} alt="Product" className="w-16 h-16 object-cover rounded" />
//               ))}
//             </div>
//           </div>
//           <div className="mb-4">
//             <label className="block text-sm font-medium">Tải lên hình ảnh mới (tối đa 4)</label>
//             <input
//               type="file"
//               multiple
//               accept="image/*"
//               onChange={handleImageChange}
//               className="w-full"
//             />
//           </div>
//           <div className="flex justify-end gap-2">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 bg-gray-200 rounded"
//               disabled={loading}
//             >
//               Hủy
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 bg-blue-500 text-white rounded"
//               disabled={loading}
//             >
//               {loading ? 'Đang lưu...' : 'Lưu'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EditProduct;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';

const EditProduct = ({ productId, token, onClose, onUpdate }) => {
    const [image1, setImage1] = useState(false);
    const [image2, setImage2] = useState(false);
    const [image3, setImage3] = useState(false);
    const [image4, setImage4] = useState(false);
    const [existingImages, setExistingImages] = useState([]);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('Men');
    const [subCategory, setSubCategory] = useState('Topwear');
    const [bestseller, setBestseller] = useState(false);
    const [sizes, setSizes] = useState([]);

    // Tải dữ liệu sản phẩm
    const fetchProduct = async () => {
        try {
            const response = await axios.post(
                `${backendUrl}/api/product/single`,
                { productId },
                { headers: { token } }
            );
            if (response.data.success) {
                const product = response.data.product;
                setName(product.name);
                setDescription(product.description);
                setPrice(product.price);
                setCategory(product.category);
                setSubCategory(product.subCategory);
                setBestseller(product.bestseller);
                setSizes(product.sizes);
                setExistingImages(product.image);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error('Không thể tải sản phẩm');
        }
    };

    useEffect(() => {
        if (productId) {
            fetchProduct();
        }
    }, [productId]);

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        // Xác thực phía client
        if (!name || !price || !category || !subCategory || sizes.length === 0) {
            toast.error('Vui lòng nhập đầy đủ tên, giá, danh mục, danh mục phụ và kích thước');
            return;
        }
        if (Number(price) <= 0) {
            toast.error('Giá tiền phải là số dương');
            return;
        }
        if (!existingImages.length && !image1 && !image2 && !image3 && !image4) {
            toast.error('Cần ít nhất một ảnh sản phẩm');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('id', productId);
            formData.append('name', name);
            formData.append('description', description);
            formData.append('price', price);
            formData.append('category', category);
            formData.append('subCategory', subCategory);
            formData.append('bestseller', bestseller);
            formData.append('sizes', JSON.stringify(sizes));

            if (image1) formData.append('image1', image1);
            if (image2) formData.append('image2', image2);
            if (image3) formData.append('image3', image3);
            if (image4) formData.append('image4', image4);

            const response = await axios.post(`${backendUrl}/api/product/edit`, formData, {
                headers: { token, 'Content-Type': 'multipart/form-data' },
            });

            if (response.data.success) {
                toast.success(response.data.message);
                onUpdate(); // Cập nhật danh sách
                onClose(); // Đóng modal
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-semibold mb-4">Chỉnh sửa sản phẩm</h2>
                <form onSubmit={onSubmitHandler} className="flex flex-col w-full items-start gap-3">
                    {/* Hiển thị hình ảnh hiện tại */}
                    {existingImages.length > 0 && (
                        <div>
                            <p className="mb-2">Hình ảnh hiện tại</p>
                            <div className="flex gap-2">
                                {existingImages.map((img, index) => (
                                    <img
                                        key={index}
                                        src={img}
                                        alt={`Current ${index + 1}`}
                                        className="w-20 h-20 object-cover rounded"
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Upload hình ảnh mới */}
                    <div>
                        <p className="mb-2">Tải lên hình ảnh mới</p>
                        <div className="flex gap-2">
                            <label htmlFor="image1">
                                <img
                                    className="w-20 cursor-pointer"
                                    src={!image1 ? assets.upload_area : URL.createObjectURL(image1)}
                                    alt=""
                                />
                                <input
                                    onChange={(e) => setImage1(e.target.files[0])}
                                    type="file"
                                    id="image1"
                                    accept="image/*"
                                    hidden
                                />
                            </label>
                            <label htmlFor="image2">
                                <img
                                    className="w-20 cursor-pointer"
                                    src={!image2 ? assets.upload_area : URL.createObjectURL(image2)}
                                    alt=""
                                />
                                <input
                                    onChange={(e) => setImage2(e.target.files[0])}
                                    type="file"
                                    id="image2"
                                    accept="image/*"
                                    hidden
                                />
                            </label>
                            <label htmlFor="image3">
                                <img
                                    className="w-20 cursor-pointer"
                                    src={!image3 ? assets.upload_area : URL.createObjectURL(image3)}
                                    alt=""
                                />
                                <input
                                    onChange={(e) => setImage3(e.target.files[0])}
                                    type="file"
                                    id="image3"
                                    accept="image/*"
                                    hidden
                                />
                            </label>
                            <label htmlFor="image4">
                                <img
                                    className="w-20 cursor-pointer"
                                    src={!image4 ? assets.upload_area : URL.createObjectURL(image4)}
                                    alt=""
                                />
                                <input
                                    onChange={(e) => setImage4(e.target.files[0])}
                                    type="file"
                                    id="image4"
                                    accept="image/*"
                                    hidden
                                />
                            </label>
                        </div>
                    </div>

                    <div className="w-full">
                        <p className="mb-2">Tên sản phẩm</p>
                        <input
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            className="w-full max-w-[500px] px-3 py-2"
                            type="text"
                            placeholder="Nhập tên sản phẩm"
                            required
                        />
                    </div>

                    <div className="w-full">
                        <p className="mb-2">Mô tả sản phẩm</p>
                        <textarea
                            onChange={(e) => setDescription(e.target.value)}
                            value={description}
                            className="w-full max-w-[500px] px-3 py-2"
                            placeholder="Viết mô tả tại đây"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
                        <div>
                            <p className="mb-2">Danh mục sản phẩm</p>
                            <select
                                onChange={(e) => setCategory(e.target.value)}
                                value={category}
                                className="w-full px-3 py-2"
                            >
                                <option value="Men">Men</option>
                                <option value="Women">Women</option>
                                <option value="Kids">Kids</option>
                            </select>
                        </div>

                        <div>
                            <p className="mb-2">Danh mục phụ</p>
                            <select
                                onChange={(e) => setSubCategory(e.target.value)}
                                value={subCategory}
                                className="w-full px-3 py-2"
                            >
                                <option value="Topwear">Topwear</option>
                                <option value="Bottomwear">Bottomwear</option>
                                <option value="Winterwear">Winterwear</option>
                            </select>
                        </div>

                        <div>
                            <p className="mb-2">Giá sản phẩm</p>
                            <input
                                onChange={(e) => setPrice(e.target.value)}
                                value={price}
                                className="w-full px-3 py-2 sm:w-[120px]"
                                type="number"
                                min="1"
                                placeholder="25"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <p className="mb-2">Kích thước sản phẩm</p>
                        <div className="flex gap-3">
                            {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                                <div
                                    key={size}
                                    onClick={() =>
                                        setSizes((prev) =>
                                            prev.includes(size) ? prev.filter((item) => item !== size) : [...prev, size]
                                        )
                                    }
                                >
                                    <p
                                        className={`${sizes.includes(size) ? 'bg-pink-100' : 'bg-slate-200'
                                            } px-3 py-1 cursor-pointer`}
                                    >
                                        {size}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-2 mt-2">
                        <input
                            onChange={() => setBestseller((prev) => !prev)}
                            checked={bestseller}
                            type="checkbox"
                            id="bestseller"
                        />
                        <label className="cursor-pointer" htmlFor="bestseller">
                            Thêm vào bestseller
                        </label>
                    </div>

                    <div className="flex gap-4 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-28 py-3 bg-gray-200 rounded cursor-pointer"
                        >
                            Hủy
                        </button>
                        <button type="submit" className="w-28 py-3 bg-black text-white rounded cursor-pointer">
                            Lưu
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProduct;