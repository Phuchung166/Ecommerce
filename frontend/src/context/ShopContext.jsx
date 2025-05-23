import React, { createContext, useEffect, useState } from "react";
// import { products } from "../assets/assets";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios'

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = '$';
    const delivery_fee = 10;
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [limit] = useState(16);
    const [totalPages, setTotalPages] = useState(1);
    const [category, setCategory] = useState([]);
    const [subCategory, setSubCategory] = useState([]);
    const [sortType, setSortType] = useState('relavent');
    const [cartItems, setCartItems] = useState({});
    const [token, setToken] = useState('');
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();




    const addToCart = async (productId, size) => {

        if (!size) {
            toast.error('Select Product Size');
            return;
        }

        let cartData = structuredClone(cartItems);

        if (cartData[productId]) {
            if (cartData[productId][size]) {
                cartData[productId][size] += 1;
            }
            else {
                cartData[productId][size] = 1;
            }
        }
        else {
            cartData[productId] = {};
            cartData[productId][size] = 1;
        }
        setCartItems(cartData);

        if (token) {
            try {

                await axios.post(backendUrl + '/api/cart/add', { productId, size }, { headers: { token } })

            } catch (error) {
                console.log(error);
                toast.error(error.message)
            }
        }
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find(item => item._id === items);
            for (const size in cartItems[items]) {
                try {
                    if (cartItems[items][size] > 0) {
                        totalAmount += cartItems[items][size] * itemInfo.price;
                    }
                } catch (error) {

                }
            }
        }
        return totalAmount;
    }

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            for (const size in cartItems[items]) {
                try {
                    if (cartItems[items][size] > 0) {
                        totalCount += cartItems[items][size];
                    }
                } catch (error) {

                }
            }
        }
        return totalCount;
    }

    // const updateQuantity = async (productId, size, quantity) => {

    //     let cartData = structuredClone(cartItems);

    //     if (quantity === 0) {
    //         // Xoá khỏi cart
    //         if (cartData[productId] && cartData[productId][size]) {
    //             delete cartData[productId][size];
    //             if (Object.keys(cartData[productId]).length === 0) {
    //                 delete cartData[productId];
    //             }
    //         }

    //         setCartItems(cartData);

    //         try {
    //             await axios.put(`${backendUrl}/api/cart/remove`, { productId, size }, { headers: { token } });
    //         } catch (error) {
    //             console.log(error);
    //             toast.error(error.message);
    //         }

    //     } else {
    //         // Cập nhật số lượng
    //         if (!cartData[productId]) cartData[productId] = {};
    //         cartData[productId][size] = quantity;

    //         setCartItems(cartData);

    //         try {
    //             await axios.put(`${backendUrl}/api/cart/update`, { productId, size, quantity }, { headers: { token } });
    //         } catch (error) {
    //             console.log(error);
    //             toast.error(error.message);
    //         }
    //     }

    // }


    const updateQuantity = async (productId, size, quantity) => {
        if (!productId || !size || isNaN(quantity) || quantity < 0) {
            toast.error('Dữ liệu không hợp lệ.');
            return;
        }

        // if (!token) {
        //     toast.error('Vui lòng đăng nhập để cập nhật giỏ hàng.');
        //     return;
        // }

        const previousCartItems = structuredClone(cartItems); // Lưu state trước để khôi phục nếu lỗi
        let cartData = structuredClone(cartItems);

        try {
            // Cập nhật state trước (optimistic update)
            if (quantity === 0) {
                // Xóa khỏi giỏ hàng
                if (cartData[productId]?.[size]) {
                    delete cartData[productId][size];
                    if (Object.keys(cartData[productId]).length === 0) {
                        delete cartData[productId];
                    }
                }
                setCartItems(cartData);

                // Gửi yêu cầu xóa
                await axios.put(`${backendUrl}/api/cart/remove`, { productId, size }, { headers: { token } })
                toast.success('Đã xóa sản phẩm khỏi giỏ hàng.')
            } else {
                // Cập nhật số lượng
                if (!cartData[productId]) cartData[productId] = {};
                cartData[productId][size] = quantity;
                setCartItems(cartData);

                // Gửi yêu cầu cập nhật
                await axios.post(`${backendUrl}/api/cart/update`, { productId, size, quantity }, { headers: { token } });
                toast.success('Đã cập nhật số lượng.');
            }
        } catch (error) {
            // Khôi phục state nếu API thất bại
            setCartItems(previousCartItems);
            console.error('Lỗi cập nhật giỏ hàng:', error);
            const errorMessage = error.response?.data?.message || 'Không thể cập nhật giỏ hàng. Vui lòng thử lại.';
            toast.error(errorMessage);
        }
    };


    // const removeFromCart = async (productId, size) => {

    //     let cartData = structuredClone(cartItems)

    //     if (cartData[productId] && cartData[productId][size]) {
    //         delete cartData[productId][size]

    //         if (Object.keys(cartData[productId]).length == 0) {
    //             delete cartData[productId]
    //         }
    //     }

    //     setCartItems(cartData)

    //     try {

    //         await axios.put(backendUrl + '/api/cart/remove', { productId, size }, { headers: { token } })

    //     } catch (error) {
    //         console.log(error);
    //         toast.error(error.message)
    //     }

    // }

    const getProductsData = async () => {
        setLoading(true)
        try {
            const response = await axios.get(backendUrl + '/api/product/list', {
                params: {
                    page,
                    limit,
                    category: category.join(','),
                    subCategory: subCategory.join(','),
                    search: showSearch ? search : '',
                    sortType,
                }
            })
            // console.log(response);

            if (response.data.success) {
                setProducts(response.data.products);
                setTotalPages(response.data.totalPages);
            } else {
                toast.error(response.data.message)
            }

        } catch (error) {
            console.error(error);
            toast.error(error.message)
        } finally {
            setLoading(false);
        }
    }

    const getUserCart = async (token) => {
        try {

            const response = await axios.post(backendUrl + '/api/cart/get', {}, { headers: { token } })
            if (response.data.success) {
                setCartItems(response.data.cartData)
            }

        } catch (error) {
            console.error(error);
            toast.error(error.message)
        }
    }

    const addComment = async (productId, comment) => {
        try {
            const response = await axios.post(backendUrl + '/api/comments/add', { productId, comment }, { headers: { token } });
            if (response.data.success) {
                toast.success('Comment added successfully');
                // Refresh comments
                getCommentsByProduct(productId);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to add comment');
        }
    };

    const getCommentsByProduct = async (productId) => {
        try {
            const response = await axios.get(backendUrl + `/api/comments/product/${productId}`);
            if (response.data.success) {
                setComments(response.data.comments);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getProductsData();
    }, [page, category, subCategory, search, showSearch, sortType]);

    useEffect(() => {
        if (!token && localStorage.getItem('token')) {
            setToken(localStorage.getItem('token'))
            getUserCart(localStorage.getItem('token'))
        }
    }, [])

    useEffect(() => {
        if (token) {
            getUserCart(token);
        }
    }, [token]);


    const value = {
        products, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        page, setPage, limit, totalPages,
        category, setCategory, subCategory, setSubCategory, sortType, setSortType,
        cartItems, addToCart, setCartItems,
        getCartCount, updateQuantity,
        getCartAmount, navigate, backendUrl,
        token, setToken,
        comments, setComments,
        addComment, getCommentsByProduct,
        loading,
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;