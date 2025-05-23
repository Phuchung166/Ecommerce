import React, { useCallback, useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';

const Cart = () => {

  const { products, currency, cartItems, updateQuantity, navigate } = useContext(ShopContext);

  const [cartData, setCartData] = useState([]);

  // useEffect(() => {

  //   if (products.length > 0) {
  //     const tempData = [];
  //     for (const items in cartItems) {
  //       for (const size in cartItems[items]) {
  //         if (cartItems[items][size] > 0) {
  //           tempData.push({
  //             _id: items,
  //             size: size,
  //             quantity: cartItems[items][size]
  //           })
  //         }
  //       }
  //     }
  //     setCartData(tempData);
  //   }
  // }, [cartItems, products])

  // Hàm tính toán cartData
  const calculateCartData = useCallback(() => {
    if (!products.length) return [];

    const tempData = [];
    for (const productId in cartItems) {
      for (const size in cartItems[productId]) {
        const quantity = cartItems[productId][size];
        if (quantity > 0) {
          tempData.push({ _id: productId, size, quantity });
        }
      }
    }
    return tempData;
  }, [cartItems, products]);

  useEffect(() => {
    setCartData(calculateCartData());
  }, [calculateCartData]);

  // Xử lý cập nhật số lượng
  const handleQuantityChange = (productId, size, value) => {
    const quantity = Number(value);
    if (isNaN(quantity) || quantity < 0) return;
    updateQuantity(productId, size, quantity);
  };

  // Xử lý xóa sản phẩm
  const handleRemoveItem = (productId, size) => {
    if (window.confirm('Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?')) {
      updateQuantity(productId, size, 0);
    }
    // updateQuantity(productId, size, 0);
  };

  return (
    <div className='border-t pt-14'>

      <div className='text-2xl mb-3'>
        {/* <p>Giỏ hàng của bạn</p> */}
        {/* <Title text1={'YOURS'} text2={'CART'} /> */}
        <Title text2={'GIỎ HÀNG CỦA BẠN'} />
      </div>

      <div>
        {
          cartData.map((item, index) => {

            const productData = products.find((product) => product._id === item._id);
            if (!productData) return null

            return (
              <div key={index} className='py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'>
                <div className='flex items-start gap-6'>
                  <img className='w-16 sm:w-20' src={productData.image[0]} alt="" />
                  <div>
                    <p className='text-xs sm:text-lg font-medium'>{productData.name}</p>
                    <div className='flex items-center gap-5 mt-2'>
                      <p>{currency}{productData.price}</p>
                      <p className='px-2 sm:px-3 sm:py-1 border bg-slate-50 rounded'>{item.size}</p>

                    </div>
                  </div>
                </div>
                {/* <input onChange={(e) => e.target.value === '' || e.target.value === '0' ? null : updateQuantity(item._id, item.size, Number(e.target.value))} className='border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1' type="number" min={1} defaultValue={item.quantity} />
                <img onClick={() => updateQuantity(item._id, item.size, 0)} className='w-4 mr-4 sm:w-5 cursor-pointer' src={assets.bin_icon} alt="" /> */}
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => e.target.value === '' || e.target.value === '0' ? null : handleQuantityChange(item._id, item.size, e.target.value)}
                  className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1 rounded"
                />
                <img
                  onClick={() => handleRemoveItem(item._id, item.size)}
                  className="w-4 mr-4 sm:w-5 cursor-pointer"
                  src={assets.bin_icon}
                  alt="Xóa"
                  title="Xóa sản phẩm"
                />
              </div>
            )
          })
        }
      </div>

      <div className='flex justify-end my-20'>
        <div className='w-full sm:w-[450px]'>
          <CartTotal />
          <div className='w-full text-end'>
            <button onClick={() => navigate('/place-order')} className='bg-[#EE4D2D] text-white text-sm my-8 px-8 py-3 cursor-pointer' disabled={cartData.length === 0} >ĐẶT HÀNG</button>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Cart
