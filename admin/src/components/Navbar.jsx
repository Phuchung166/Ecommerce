import React from 'react'
import { assets } from '../assets/assets'

const Navbar = ({setToken}) => {
  return (
    <div className='flex items-center py-2 px-[4%] justify-between bg-pink-100 '>
      {/* <img className='w-[max(10%, 80px)]' src={assets.logo} alt="" /> */}
      <h1 className='w-[max(10%, 80px)] text-3xl'>Admin DashBoard</h1>
      {/* <img className="absolute top-2 left-2 w-[max(5%,60px)]" src={assets.logo_PH2} alt="" /> */}
      <button onClick={()=>setToken('')} className='bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm cursor-pointer'>Logout</button>
    </div>
  )
}

export default Navbar
