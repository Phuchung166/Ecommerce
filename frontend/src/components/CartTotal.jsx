import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';

const CartTotal = () => {

    const {currency, delivery_fee, getCartAmount} = useContext(ShopContext);

  return (
    <div className='w-full'>
      <div className='text-2xl'>
        {/* <Title text1={'CART'} text2={'TOTALS'} /> */}
        <Title text2={'TỔNG ĐƠN HÀNG'} />
      </div>

      <div className='flex flex-col gap-2 mt-2 text-sm'>
        <div className='flex justify-between'>
            <p>Tổng tiền hàng</p>
            <p>{currency}{getCartAmount()}.00</p>
        </div>
        <hr />
        <div className='flex justify-between'>
            <p>Phí vận chuyển</p>
            <p>{currency}{delivery_fee}.00</p>
        </div>
        <hr />
        <div className='flex justify-between'>
            <b>Tổng thanh toán</b>
            <b>{currency}{getCartAmount() + delivery_fee}.00</b>
        </div>
      </div>
    </div>
  )
}

export default CartTotal
