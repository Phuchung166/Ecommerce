import React from 'react'

const NewsletterBox = () => {

    const onSubmitHandler = (event) => {
        event.preventDefault()
        // Send email to backend
        // console.log('Email submitted:', event.target.email.value)
      }

  return (
    <div className='text-center'>
      <p className='text-2xl font-medium text-gray-800'>Đăng ký ngay để được giảm giá 20%</p>
      <p className='text-gray-400'>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
      <form onSubmit={onSubmitHandler} className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3'>
        <input className='w-full sm:flex-1 outline-none' type="email" name="email" placeholder='Enter your email' required/>
        <button type='submit' className='bg-black text-white text-xs px-10 py-4 '>ĐĂNG KÝ</button>
      </form>
    </div>
  )
}

export default NewsletterBox
