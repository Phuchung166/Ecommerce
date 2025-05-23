import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';
import axios from 'axios';
import ProductFeedback from '../components/ProductFeedback';

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, backendUrl } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [averageRating, setAverageRating] = useState(0);

  // Lấy userId từ token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        setCurrentUserId(decoded.id);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  const fetchProductData = async () => {
    products.map((item) => {
      if (item._id === productId) {
        setProductData(item);
        setImage(item.image[0]);
        return null;
      }
    });
  };

  const fetchAverageRating = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/feedback/average/${productId}`);
      if (res.data.success) {
        setAverageRating(res.data.averageRating);
      }
    } catch (err) {
      console.error('Error fetching average rating:', err);
    }
  };

  useEffect(() => {
    fetchProductData();
    fetchAverageRating();
  }, [productId, products]);

  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/* -----------------Product Data------------------ */}
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* -----------------Product Image-------------------- */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {productData.image.map((item, index) => (
              <img
                onClick={() => setImage(item)}
                src={item}
                key={index}
                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
                alt=""
              />
            ))}
          </div>
          <div className="w-full sm:w-[80%]">
            <img className="w-full h-auto" src={image} alt="" />
          </div>
        </div>

        {/* ----------Product Info------------ */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
          
          <div className="flex items-center gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <img
                key={star}
                src={star <= Math.round(averageRating) ? assets.star_icon : assets.star_dull_icon}
                alt=""
                className="w-3 5"
              />
            ))}
            {/* <p className="pl-2">({comments.length})</p> */}
          </div>
          
          <p className="mt-5 text-3xl font-medium">
            {currency}
            {productData.price}
          </p>
          <p className="mt-5 text-gray-500 md:w-4/5">{productData.description}</p>
          <div className="flex flex-col gap-4 my-8">
            <p>Chọn kích thước</p>
            <div className="flex gap-2">
              {productData.sizes.map((item, index) => (
                <button
                  onClick={() => setSize(item)}
                  className={`border py-2 px-4 bg-gray-100 ${item === size ? 'border-orange-500' : ''} cursor-pointer`}
                  key={index}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => addToCart(productData._id, size)}
            className="bg-[#EE4D2D] text-white px-8 py-3 text-sm active:bg-gray-50 cursor-pointer"
          >
            Thêm vào giỏ hàng
          </button>
          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>100% Original product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>

      {/* -----------------Description & Review Section--------------- */}
      <div className="mt-20">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('description')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'description'
                ? 'border-b-2 border-[#EE4D2D] text-[#EE4D2D]'
                : 'text-gray-500'
              }`}
          >
            Mô tả
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'reviews'
                ? 'border-b-2 border-[#EE4D2D] text-[#EE4D2D]'
                : 'text-gray-500'
              }`}
          >
            Đánh giá
          </button>
        </div>
        <div className="px-6 py-8 bg-white rounded-lg shadow-sm">
          {activeTab === 'description' ? (
            <div className="flex flex-col gap-4 text-gray-600">
              <p>
                An e-commerce website is an online platform that facilitates the buying and selling of
                products or services over the internet. It serves as a virtual marketplace where
                businesses and individuals can showcase their products, interact with customers, and
                conduct transactions without the need for a physical presence. E-commerce websites have
                gained immense popularity due to their convenience, accessibility, and the global reach
                they offer.
              </p>
              <p>
                E-commerce websites typically display products or services along with detailed
                descriptions, images, prices, and any available variations (e.g., sizes, colors). Each
                product usually has its own dedicated page with relevant information.
              </p>
            </div>
          ) : (
            <ProductFeedback
              productId={productId}
              currentUserId={currentUserId}
            />
          )}
        </div>
      </div>

      {/* ------------Display related products----------- */}
      <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;



// import React, { useContext, useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { ShopContext } from '../context/ShopContext';
// import { assets } from '../assets/assets';
// import RelatedProducts from '../components/RelatedProducts';
// import axios from 'axios';

// const Product = () => {
//   const { productId } = useParams();
//   const { products, currency, addToCart, backendUrl } = useContext(ShopContext);
//   const [productData, setProductData] = useState(false);
//   const [image, setImage] = useState('');
//   const [size, setSize] = useState('');


//   const [rating, setRating] = useState(0);
//   const [averageRating, setAverageRating] = useState(0);
//   const [newComment, setNewComment] = useState('');
//   const [comments, setComments] = useState([]);
//   const [activeTab, setActiveTab] = useState('description'); // Quản lý tab Description/Reviews

//   const fetchProductData = async () => {
//     products.map((item) => {
//       if (item._id === productId) {
//         setProductData(item);
//         setImage(item.image[0]);
//         return null;
//       }
//     });
//   };

//   const fetchComments = async () => {
//     try {
//       const res = await axios.get(`${backendUrl}/api/comments/product/${productId}`);
//       if (res.data.success) {
//         setComments(res.data.comments);
//       }
//     } catch (err) {
//       console.error('Error fetching comments:', err);
//     }
//   };

//   const handleCommentSubmit = async () => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       alert('Bạn cần đăng nhập để gửi đánh giá');
//       return;
//     }

//     if (!newComment.trim() || rating === 0) {
//       alert('Vui lòng nhập nội dung đánh giá và chọn số sao');
//       return;
//     }

//     try {
//       const res = await axios.post(
//         `${backendUrl}/api/comments/add`,
//         { productId, comment: newComment, rating },
//         { headers: { token } }
//       );

//       if (res.data.success) {
//         setNewComment('');
//         setRating(0);
//         fetchComments();
//         alert('Đánh giá đã được gửi!');
//       } else {
//         alert(res.data.message);
//       }
//     } catch (err) {
//       console.error('Error submitting comment:', err);
//       alert('Gửi đánh giá thất bại. Vui lòng thử lại sau.');
//     }
//   };

//   const fetchAverageRating = async () => {
//     try {
//       const res = await axios.get(`${backendUrl}/api/comments/average/${productId}`);
//       if (res.data.success) {
//         setAverageRating(res.data.averageRating);
//       }
//     } catch (err) {
//       console.error('Error fetching average rating:', err);
//     }
//   };

//   useEffect(() => {
//     fetchProductData();
//     fetchComments();
//     fetchAverageRating();
//   }, [productId, products]);

//   return productData ? (
//     <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
//       {/* -----------------Product Data------------------ */}
//       <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
//         {/* -----------------Product Image-------------------- */}
//         <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
//           <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
//             {productData.image.map((item, index) => (
//               <img
//                 onClick={() => setImage(item)}
//                 src={item}
//                 key={index}
//                 className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
//                 alt=""
//               />
//             ))}
//           </div>
//           <div className="w-full sm:w-[80%]">
//             <img className="w-full h-auto" src={image} alt="" />
//           </div>
//         </div>

//         {/* ----------Product Info------------ */}
//         <div className="flex-1">
//           <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
//           {/* <div className="flex items-center gap-1 mt-2">
//             <img src={assets.star_icon} alt="" className="w-3 5" />
//             <img src={assets.star_icon} alt="" className="w-3 5" />
//             <img src={assets.star_icon} alt="" className="w-3 5" />
//             <img src={assets.star_icon} alt="" className="w-3 5" />
//             <img src={assets.star_dull_icon} alt="" className="w-3 5" />
//             <p className="pl-2">(122)</p>
//           </div> */}

//           <div className="flex items-center gap-1 mt-2">
//             {[1, 2, 3, 4, 5].map((star) => (
//               <img
//                 key={star}
//                 src={star <= Math.round(averageRating) ? assets.star_icon : assets.star_dull_icon}
//                 alt=""
//                 className="w-3 5"
//               />
//             ))}

//             <p className="pl-2">({comments.length})</p>
//           </div>



//           <p className="mt-5 text-3xl font-medium">
//             {currency}
//             {productData.price}
//           </p>
//           <p className="mt-5 text-gray-500 md:w-4/5">{productData.description}</p>
//           <div className="flex flex-col gap-4 my-8">
//             <p>Chọn kích thước</p>
//             <div className="flex gap-2">
//               {productData.sizes.map((item, index) => (
//                 <button
//                   onClick={() => setSize(item)}
//                   className={`border py-2 px-4 bg-gray-100 ${item === size ? 'border-orange-500' : ''} cursor-pointer`}
//                   key={index}
//                 >
//                   {item}
//                 </button>
//               ))}
//             </div>
//           </div>
//           <button
//             onClick={() => addToCart(productData._id, size)}
//             className="bg-[#EE4D2D] text-white px-8 py-3 text-sm active:bg-gray-50 cursor-pointer"
//           >
//             Thêm vào giỏ hàng
//           </button>
//           <hr className="mt-8 sm:w-4/5" />
//           <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
//             <p>100% Original product.</p>
//             <p>Cash on delivery is available on this product.</p>
//             <p>Easy return and exchange policy within 7 days.</p>
//           </div>
//         </div>
//       </div>

//       {/* -----------------Description & Review Section--------------- */}
//       <div className="mt-20">
//         <div className="flex">
//           <button
//             onClick={() => setActiveTab('description')}
//             className={`border px-5 py-3 text-sm ${activeTab === 'description' ? 'bg-[#EE4D2D] text-white' : ''}`}
//           >
//             Mô tả
//           </button>
//           <button
//             onClick={() => setActiveTab('reviews')}
//             className={`border px-5 py-3 text-sm ${activeTab === 'reviews' ? 'bg-[#EE4D2D] text-white' : ''}`}
//           >
//             Đánh giá
//           </button>
//         </div>
//         <div className="border px-6 py-6 text-sm text-gray-500">
//           {activeTab === 'description' ? (
//             <div className="flex flex-col gap-4">
//               <p>
//                 An e-commerce website is an online platform that facilitates the buying and selling of
//                 products or services over the internet. It serves as a virtual marketplace where
//                 businesses and individuals can showcase their products, interact with customers, and
//                 conduct transactions without the need for a physical presence. E-commerce websites have
//                 gained immense popularity due to their convenience, accessibility, and the global reach
//                 they offer.
//               </p>
//               <p>
//                 E-commerce websites typically display products or services along with detailed
//                 descriptions, images, prices, and any available variations (e.g., sizes, colors). Each
//                 product usually has its own dedicated page with relevant information.
//               </p>
//             </div>
//           ) : (
//             <div className="flex flex-col gap-6">
//               {/* Form đánh giá */}
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-700">Viết đánh giá</h3>
//                 <div className="flex items-center gap-1 my-3">
//                   {[1, 2, 3, 4, 5].map((star) => (
//                     <svg
//                       key={star}
//                       className={`w-6 h-6 cursor-pointer ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
//                       onClick={() => setRating(star)}
//                       fill="currentColor"
//                       viewBox="0 0 20 20"
//                     >
//                       <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                     </svg>
//                   ))}
//                 </div>
//                 <textarea
//                   rows="4"
//                   value={newComment}
//                   onChange={(e) => setNewComment(e.target.value)}
//                   className="w-full border p-3 rounded resize-none text-gray-700"
//                   placeholder="Nhập nhận xét của bạn..."
//                 ></textarea>
//                 <button
//                   onClick={handleCommentSubmit}
//                   className="mt-3 bg-[#EE4D2D] text-white py-2 px-6 rounded hover:bg-orange-600 text-sm"
//                 >
//                   Gửi đánh giá
//                 </button>
//               </div>

//               {/* Danh sách đánh giá */}
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-700">Đánh giá sản phẩm</h3>
//                 {comments.length > 0 ? (
//                   <div className="space-y-4 mt-4">
//                     {comments.map((cmt) => (
//                       <div key={cmt._id} className="border p-3 rounded bg-gray-50">
//                         <div className="flex items-center gap-1 mb-1">
//                           {[1, 2, 3, 4, 5].map((star) => (
//                             <svg
//                               key={star}
//                               className={`w-4 h-4 ${star <= cmt.rating ? 'text-yellow-400' : 'text-gray-300'}`}
//                               fill="currentColor"
//                               viewBox="0 0 20 20"
//                             >
//                               <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                             </svg>
//                           ))}
//                         </div>
//                         <div className="text-sm text-gray-700 font-semibold">
//                           {cmt.userId?.firstName} {cmt.userId?.lastName}
//                         </div>
//                         <div className="text-xs text-gray-400 mb-1">
//                           {new Date(cmt.createdAt).toLocaleString()}
//                         </div>
//                         <div className="text-gray-600">{cmt.comment}</div>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <p className="text-gray-500 mt-4">Chưa có đánh giá nào.</p>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ------------Display related products----------- */}
//       <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
//     </div>
//   ) : (
//     <div className="opacity-0"></div>
//   );
// };

// export default Product;



// import React, { useContext, useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { ShopContext } from '../context/ShopContext';
// import { assets } from '../assets/assets';
// import RelatedProducts from '../components/RelatedProducts';
// import axios from 'axios';

// const Product = () => {
//   const { productId } = useParams();
//   const { products, currency, addToCart, backendUrl } = useContext(ShopContext);
//   const [productData, setProductData] = useState(false);
//   const [image, setImage] = useState('');
//   const [size, setSize] = useState('');
//   const [rating, setRating] = useState(0);
//   const [newComment, setNewComment] = useState('');
//   const [comments, setComments] = useState([]);
//   const [activeTab, setActiveTab] = useState('description');
//   const [loading, setLoading] = useState(false);
//   const [editingCommentId, setEditingCommentId] = useState(null);
//   const [editComment, setEditComment] = useState('');
//   const [editRating, setEditRating] = useState(0);
//   const [currentUserId, setCurrentUserId] = useState(null);
//   const [averageRating, setAverageRating] = useState(0);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   // Lấy thông tin người dùng hiện tại (userId) từ token
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       try {
//         const decoded = JSON.parse(atob(token.split('.')[1]));
//         setCurrentUserId(decoded.id);
//       } catch (error) {
//         console.error('Error decoding token:', error);
//       }
//     }
//   }, []);

//   const fetchProductData = async () => {
//     products.map((item) => {
//       if (item._id === productId) {
//         setProductData(item);
//         setImage(item.image[0]);
//         return null;
//       }
//     });
//   };

//   // const fetchComments = async () => {
//   //   try {
//   //     const res = await axios.get(`${backendUrl}/api/comments/product/${productId}?page=1&limit=10`);
//   //     if (res.data.success) {
//   //       setComments(res.data.comments);
//   //     }
//   //   } catch (err) {
//   //     console.error('Error fetching comments:', err);
//   //   }
//   // };
//   const fetchComments = async () => {
//     try {
//       const res = await axios.get(`${backendUrl}/api/comments/product/${productId}?page=${page}&limit=10`);
//       if (res.data.success) {
//         setComments(res.data.comments);
//         setTotalPages(Math.ceil(res.data.total / res.data.limit));
//       }
//     } catch (err) {
//       console.error('Error fetching comments:', err);
//     }
//   };

//   const handleCommentSubmit = async () => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       alert('Bạn cần đăng nhập để gửi đánh giá');
//       return;
//     }

//     if (!newComment.trim() || rating === 0) {
//       alert('Vui lòng nhập nội dung đánh giá và chọn số sao');
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await axios.post(
//         `${backendUrl}/api/comments/add`,
//         { productId, comment: newComment, rating },
//         { headers: { token } }
//       );

//       if (res.data.success) {
//         setNewComment('');
//         setRating(0);
//         fetchComments();
//         alert('Đánh giá đã được gửi!');
//       } else {
//         alert(res.data.message);
//       }
//     } catch (err) {
//       alert('Gửi đánh giá thất bại: ' + err.message);
//     }
//     setLoading(false);
//   };

//   const handleEditComment = async (commentId) => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       alert('Bạn cần đăng nhập để chỉnh sửa đánh giá');
//       return;
//     }

//     if (!editComment.trim() || editRating === 0) {
//       alert('Vui lòng nhập nội dung đánh giá và chọn số sao');
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await axios.put(
//         `${backendUrl}/api/comments/update/${commentId}`,
//         { comment: editComment, rating: editRating },
//         { headers: { token } }
//       );

//       if (res.data.success) {
//         setEditingCommentId(null);
//         setEditComment('');
//         setEditRating(0);
//         fetchComments();
//         alert('Đánh giá đã được cập nhật!');
//       } else {
//         alert(res.data.message);
//       }
//     } catch (err) {
//       alert('Chỉnh sửa đánh giá thất bại: ' + err.message);
//     }
//     setLoading(false);
//   };

//   const handleDeleteComment = async (commentId) => {
//     if (!window.confirm('Bạn có chắc muốn xóa đánh giá này?')) return;

//     const token = localStorage.getItem('token');
//     if (!token) {
//       alert('Bạn cần đăng nhập để xóa đánh giá');
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await axios.delete(`${backendUrl}/api/comments/delete/${commentId}`, {
//         headers: { token }
//       });

//       if (res.data.success) {
//         fetchComments();
//         alert('Đánh giá đã được xóa!');
//       } else {
//         alert(res.data.message);
//       }
//     } catch (err) {
//       alert('Xóa đánh giá thất bại: ' + err.message);
//     }
//     setLoading(false);
//   };


//   const fetchAverageRating = async () => {
//     try {
//       const res = await axios.get(`${backendUrl}/api/comments/average/${productId}`);
//       if (res.data.success) {
//         setAverageRating(res.data.averageRating);
//       }
//     } catch (err) {
//       console.error('Error fetching average rating:', err);
//     }
//   };


//   useEffect(() => {
//     fetchProductData();
//     fetchComments();
//     fetchAverageRating();
//   }, [productId, products]);

//   return productData ? (
//     <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
//       {/* -----------------Product Data------------------ */}
//       <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
//         {/* -----------------Product Image-------------------- */}
//         <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
//           <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
//             {productData.image.map((item, index) => (
//               <img
//                 onClick={() => setImage(item)}
//                 src={item}
//                 key={index}
//                 className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
//                 alt=""
//               />
//             ))}
//           </div>
//           <div className="w-full sm:w-[80%]">
//             <img className="w-full h-auto" src={image} alt="" />
//           </div>
//         </div>

//         {/* ----------Product Info------------ */}
//         <div className="flex-1">
//           <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
//           <div className="flex items-center gap-1 mt-2">
//             {[1, 2, 3, 4, 5].map((star) => (
//               <img
//                 key={star}
//                 src={star <= Math.round(averageRating) ? assets.star_icon : assets.star_dull_icon}
//                 alt=""
//                 className="w-3 5"
//               />
//             ))}
//             <p className="pl-2">({comments.length})</p>
//           </div>
//           <p className="mt-5 text-3xl font-medium">
//             {currency}
//             {productData.price}
//           </p>
//           <p className="mt-5 text-gray-500 md:w-4/5">{productData.description}</p>
//           <div className="flex flex-col gap-4 my-8">
//             <p>Chọn kích thước</p>
//             <div className="flex gap-2">
//               {productData.sizes.map((item, index) => (
//                 <button
//                   onClick={() => setSize(item)}
//                   className={`border py-2 px-4 bg-gray-100 ${item === size ? 'border-orange-500' : ''} cursor-pointer`}
//                   key={index}
//                 >
//                   {item}
//                 </button>
//               ))}
//             </div>
//           </div>
//           <button
//             onClick={() => addToCart(productData._id, size)}
//             className="bg-[#EE4D2D] text-white px-8 py-3 text-sm active:bg-gray-50 cursor-pointer"
//           >
//             Thêm vào giỏ hàng
//           </button>
//           <hr className="mt-8 sm:w-4/5" />
//           <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
//             <p>100% Original product.</p>
//             <p>Cash on delivery is available on this product.</p>
//             <p>Easy return and exchange policy within 7 days.</p>
//           </div>
//         </div>
//       </div>

//       {/* -----------------Description & Review Section--------------- */}
//       <div className="mt-20">
//         <div className="flex border-b">
//           <button
//             onClick={() => setActiveTab('description')}
//             className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'description'
//               ? 'border-b-2 border-[#EE4D2D] text-[#EE4D2D]'
//               : 'text-gray-500'
//               }`}
//           >
//             Mô tả
//           </button>
//           <button
//             onClick={() => setActiveTab('reviews')}
//             className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'reviews'
//               ? 'border-b-2 border-[#EE4D2D] text-[#EE4D2D]'
//               : 'text-gray-500'
//               }`}
//           >
//             Đánh giá ({comments.length})
//           </button>
//         </div>
//         <div className="px-6 py-8 bg-white rounded-lg shadow-sm">
//           {activeTab === 'description' ? (
//             <div className="flex flex-col gap-4 text-gray-600">
//               <p>
//                 An e-commerce website is an online platform that facilitates the buying and selling of
//                 products or services over the internet. It serves as a virtual marketplace where
//                 businesses and individuals can showcase their products, interact with customers, and
//                 conduct transactions without the need for a physical presence. E-commerce websites have
//                 gained immense popularity due to their convenience, accessibility, and the global reach
//                 they offer.
//               </p>
//               <p>
//                 E-commerce websites typically display products or services along with detailed
//                 descriptions, images, prices, and any available variations (e.g., sizes, colors). Each
//                 product usually has its own dedicated page with relevant information.
//               </p>
//             </div>
//           ) : (
//             <div className="flex flex-col gap-8">
//               {/* Form đánh giá */}
//               <div className="bg-gray-50 p-6 rounded-lg">
//                 <h3 className="text-xl font-semibold text-gray-800 mb-4">Chia sẻ đánh giá của bạn</h3>
//                 <div className="flex items-center gap-2 mb-4">
//                   {[1, 2, 3, 4, 5].map((star) => (
//                     <svg
//                       key={star}
//                       className={`w-8 h-8 cursor-pointer transition-colors ${star <= rating ? 'text-yellow-400' : 'text-gray-300'
//                         } hover:text-yellow-300`}
//                       onClick={() => setRating(star)}
//                       fill="currentColor"
//                       viewBox="0 0 20 20"
//                     >
//                       <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                     </svg>
//                   ))}
//                 </div>
//                 <textarea
//                   rows="4"
//                   value={newComment}
//                   onChange={(e) => setNewComment(e.target.value)}
//                   className="w-full border border-gray-200 p-3 rounded-lg resize-none text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#EE4D2D] transition"
//                   placeholder="Hãy cho chúng tôi biết cảm nhận của bạn về sản phẩm..."
//                 ></textarea>
//                 <button
//                   onClick={handleCommentSubmit}
//                   disabled={loading}
//                   className={`mt-4 bg-[#EE4D2D] text-white py-2 px-6 rounded-lg hover:bg-orange-600 text-sm font-medium transition ${loading ? 'opacity-50 cursor-not-allowed' : ''
//                     }`}
//                 >
//                   {loading ? 'Đang gửi...' : 'Gửi đánh giá'}
//                 </button>
//               </div>

//               {/* Danh sách đánh giá */}
//               <div>
//                 <h3 className="text-xl font-semibold text-gray-800 mb-6">Đánh giá từ khách hàng</h3>
//                 {comments.length > 0 ? (
//                   <div className="space-y-6">
//                     {comments.map((cmt) => (
//                       <div
//                         key={cmt._id}
//                         className="flex gap-4 p-4 bg-gray-50 rounded-lg shadow-sm"
//                       >
//                         <img
//                           src={cmt.userId?.avatar || 'https://via.placeholder.com/40'}
//                           alt="Avatar"
//                           className="w-12 h-12 rounded-full object-cover"
//                         />
//                         <div className="flex-1">
//                           {editingCommentId === cmt._id ? (
//                             <div className="bg-white p-4 rounded-lg border">
//                               <div className="flex items-center gap-2 mb-3">
//                                 {[1, 2, 3, 4, 5].map((star) => (
//                                   <svg
//                                     key={star}
//                                     className={`w-6 h-6 cursor-pointer ${star <= editRating ? 'text-yellow-400' : 'text-gray-300'
//                                       } hover:text-yellow-300`}
//                                     onClick={() => setEditRating(star)}
//                                     fill="currentColor"
//                                     viewBox="0 0 20 20"
//                                   >
//                                     <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3 .921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784 .57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81 .588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                                   </svg>
//                                 ))}
//                               </div>
//                               <textarea
//                                 rows="3"
//                                 value={editComment}
//                                 onChange={(e) => setEditComment(e.target.value)}
//                                 className="w-full border border-gray-200 p-2 rounded-lg resize-none text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#EE4D2D]"
//                                 placeholder="Chỉnh sửa nhận xét..."
//                               ></textarea>
//                               <div className="flex gap-2 mt-3">
//                                 <button
//                                   onClick={() => handleEditComment(cmt._id)}
//                                   disabled={loading}
//                                   className={`bg-[#EE4D2D] text-white py-1 px-4 rounded hover:bg-orange-600 text-sm ${loading ? 'opacity-50 cursor-not-allowed' : ''
//                                     }`}
//                                 >
//                                   {loading ? 'Đang lưu...' : 'Lưu'}
//                                 </button>
//                                 <button
//                                   onClick={() => setEditingCommentId(null)}
//                                   className="bg-gray-200 text-gray-700 py-1 px-4 rounded hover:bg-gray-300 text-sm"
//                                 >
//                                   Hủy
//                                 </button>
//                               </div>
//                             </div>
//                           ) : (
//                             <>
//                               <div className="flex items-center justify-between">
//                                 <div className="flex items-center gap-2">
//                                   <span className="font-semibold text-gray-800">
//                                     {cmt.userId?.firstName} {cmt.userId?.lastName}
//                                   </span>
//                                   <div className="flex items-center gap-1">
//                                     {[1, 2, 3, 4, 5].map((star) => (
//                                       <svg
//                                         key={star}
//                                         className={`w-5 h-5 ${star <= cmt.rating ? 'text-yellow-400' : 'text-gray-300'
//                                           }`}
//                                         fill="currentColor"
//                                         viewBox="0 0 20 20"
//                                       >
//                                         <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3 .921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784 .57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81 .588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                                       </svg>
//                                     ))}
//                                   </div>
//                                 </div>
//                                 {cmt.userId?._id === currentUserId && (
//                                   <div className="flex gap-2">
//                                     <button
//                                       onClick={() => {
//                                         setEditingCommentId(cmt._id);
//                                         setEditComment(cmt.comment);
//                                         setEditRating(cmt.rating);
//                                       }}
//                                       className="text-blue-600 hover:text-blue-800 text-sm"
//                                     >
//                                       Chỉnh sửa
//                                     </button>
//                                     <button
//                                       onClick={() => handleDeleteComment(cmt._id)}
//                                       className="text-red-600 hover:text-red-800 text-sm"
//                                     >
//                                       Xóa
//                                     </button>
//                                   </div>
//                                 )}
//                               </div>
//                               <p className="text-sm text-gray-500 mt-1">
//                                 {new Date(cmt.createdAt).toLocaleString()}
//                               </p>
//                               <p className="text-gray-600 mt-2">{cmt.comment}</p>
//                             </>
//                           )}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <p className="text-gray-500">Chưa có đánh giá nào. Hãy là người đầu tiên chia sẻ cảm nhận!</p>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>


//       {/* // Thêm vào cuối danh sách đánh giá: */}
//       <div className="flex justify-center gap-3 mt-6">
//         <button
//           onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
//           disabled={page === 1}
//           className="px-4 py-2 bg-gray-200 rounded-lg text-sm disabled:opacity-50"
//         >
//           Trước
//         </button>
//         <span className="text-sm text-gray-600">
//           Trang {page} / {totalPages}
//         </span>
//         <button
//           onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
//           disabled={page === totalPages}
//           className="px-4 py-2 bg-gray-200 rounded-lg text-sm disabled:opacity-50"
//         >
//           Sau
//         </button>
//       </div>

//       {/* ------------Display related products----------- */}
//       <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
//     </div>
//   ) : (
//     <div className="opacity-0"></div>
//   );
// };

// export default Product;