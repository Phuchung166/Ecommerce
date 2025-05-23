// import React, { useState } from "react";

// const Add = () => {
//   const [selectedSizes, setSelectedSizes] = useState([]);

//   const toggleSize = (size) => {
//     setSelectedSizes((prev) =>
//       prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
//     );
//   };

//   return (
//     <div className="p-6 max-w-6xl mx-auto bg-gray-100 min-h-screen">
//       {/* Upload Images */}
//       <div>
//         <p className="mb-2 text-gray-600 font-medium">Upload Image</p>
//         <div className="grid grid-cols-4 gap-2">
//           {[1, 2, 3, 4].map((index) => (
//             <div
//               key={index}
//               className="border border-dashed border-gray-400 w-24 h-24 flex items-center justify-center text-gray-400 cursor-pointer"
//             >
//               Upload
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Product Name */}
//       <div className="mt-6">
//         <p className="mb-1 text-gray-600 font-medium">Product name</p>
//         <input
//           type="text"
//           placeholder="Type here"
//           className="w-full border border-gray-300 p-2 rounded-md"
//         />
//       </div>

//       {/* Product Description */}
//       <div className="mt-4">
//         <p className="mb-1 text-gray-600 font-medium">Product description</p>
//         <textarea
//           placeholder="Write content here"
//           className="w-full border border-gray-300 p-2 rounded-md"
//         />
//       </div>

//       {/* Category, Subcategory & Price */}
//       <div className="mt-4 flex gap-4">
//         <div className="w-1/3">
//           <p className="mb-1 text-gray-600 font-medium">Product category</p>
//           <select className="w-full border border-gray-300 p-2 rounded-md">
//             <option>Men</option>
//             <option>Women</option>
//           </select>
//         </div>
//         <div className="w-1/3">
//           <p className="mb-1 text-gray-600 font-medium">Sub category</p>
//           <select className="w-full border border-gray-300 p-2 rounded-md">
//             <option>Topwear</option>
//             <option>Bottomwear</option>
//           </select>
//         </div>
//         <div className="w-1/3">
//           <p className="mb-1 text-gray-600 font-medium">Product Price</p>
//           <input
//             type="number"
//             placeholder="Price"
//             className="w-full border border-gray-300 p-2 rounded-md"
//           />
//         </div>
//       </div>

//       {/* Product Sizes */}
//       <div className="mt-4">
//         <p className="mb-2 text-gray-600 font-medium">Product Sizes</p>
//         <div className="flex gap-2">
//           {["S", "M", "L", "XL", "XXL"].map((size) => (
//             <button
//               key={size}
//               className={`px-4 py-2 border border-gray-300 rounded-md ${
//                 selectedSizes.includes(size) ? "bg-gray-700 text-white" : "bg-gray-200"
//               }`}
//               onClick={() => toggleSize(size)}
//             >
//               {size}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Bestseller Checkbox */}
//       <div className="mt-4 flex items-center gap-2">
//         <input type="checkbox" id="bestseller" />
//         <label htmlFor="bestseller" className="text-gray-600 font-medium">
//           Add to bestseller
//         </label>
//       </div>

//       {/* Submit Button */}
//       <div className="mt-6">
//         <button className="px-6 py-2 bg-black text-white font-semibold rounded-md">
//           ADD
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Add;



import React, { useState } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const Add = ({ token }) => {

  const [image1, setImage1] = useState(false)
  const [image2, setImage2] = useState(false)
  const [image3, setImage3] = useState(false)
  const [image4, setImage4] = useState(false)

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("Men")
  const [subCategory, setSubCategory] = useState("Topwear")
  const [bestseller, setBestseller] = useState(false)
  const [sizes, setSizes] = useState([])

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    try {

      const formData = new FormData()

      formData.append('name', name)
      formData.append('description', description)
      formData.append('price', price)
      formData.append('category', category)
      formData.append('subCategory', subCategory)
      formData.append('bestseller', bestseller)
      formData.append('sizes', JSON.stringify(sizes))

      if (image1) formData.append('image1', image1)
      if (image2) formData.append('image2', image2)
      if (image3) formData.append('image3', image3)
      if (image4) formData.append('image4', image4)

      // const response = await fetch('http://localhost:5000/api/products', {
      //   method: 'POST',
      //   body: formData
      // })

      const response = await axios.post(backendUrl + "/api/product/add", formData, { headers: { token } })


      if (response.data.success) {
        // toast.success('Product added successfully')
        toast.success(response.data.message)
        setName("")
        setDescription("")
        setPrice("")
        // setCategory("Men")
        // setSubCategory("Topwear")
        // setBestseller(false)
        // setSizes([])
        setImage1(false)
        setImage2(false)
        setImage3(false)
        setImage4(false)
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }

  }


  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3'>
      {/* Upload Images */}
      <div>
        <p className='mb-2'>Upload Image</p>

        <div className='flex gap-2'>
          <label htmlFor="image1">
            <img className='w-20 cursor-pointer' src={!image1 ? assets.upload_area : URL.createObjectURL(image1)} alt="" />
            <input onChange={(e) => setImage1(e.target.files[0])} type="file" id="image1" hidden />
          </label>
          <label htmlFor="image2">
            <img className='w-20 cursor-pointer' src={!image2 ? assets.upload_area : URL.createObjectURL(image2)} alt="" />
            <input onChange={(e) => setImage2(e.target.files[0])} type="file" id="image2" hidden />
          </label>
          <label htmlFor="image3">
            <img className='w-20 cursor-pointer' src={!image3 ? assets.upload_area : URL.createObjectURL(image3)} alt="" />
            <input onChange={(e) => setImage3(e.target.files[0])} type="file" id="image3" hidden />
          </label>
          <label htmlFor="image4">
            <img className='w-20 cursor-pointer' src={!image4 ? assets.upload_area : URL.createObjectURL(image4)} alt="" />
            <input onChange={(e) => setImage4(e.target.files[0])} type="file" id="image4" hidden />
          </label>
        </div>
      </div>


      <div className='w-full'>
        <p className='mb-2'>Product Name</p>
        <input onChange={(e) => setName(e.target.value)} value={name} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Type here' required />
      </div>

      <div className='w-full'>
        <p className='mb-2'>Product description</p>
        <textarea onChange={(e)=>setDescription(e.target.value)} value={description} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Write content here' required />
      </div>


      <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>

        <div>
          <p className='mb-2'>Product category</p>
          <select onChange={(e) => setCategory(e.target.value)} className='w-full px-3 py-2' >
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>

        <div>
          <p className='mb-2'>Sub category</p>
          <select onChange={(e) => setSubCategory(e.target.value)} className='w-full px-3 py-2' >
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Winterwear">Winterwear</option>
          </select>
        </div>

        <div>
          <p className='mb-2'>Product Price</p>
          <input onChange={(e) => setPrice(e.target.value)} className='w-full px-3 py-2 sm:w-[120px]' type="number" placeholder='25' required />
        </div>

      </div>


      <div>
        <p className='mb-2'>Product Sizes</p>
        <div className='flex gap-3'>
          <div onClick={() => setSizes(prev => prev.includes("S") ? prev.filter(item => item !== "S") : [...prev, "S"])}>
            <p className={`${sizes.includes("S") ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>S</p>
          </div>

          <div onClick={() => setSizes(prev => prev.includes("M") ? prev.filter(item => item !== "M") : [...prev, "M"])}>
            <p className={`${sizes.includes("M") ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>M</p>
          </div>

          <div onClick={() => setSizes(prev => prev.includes("L") ? prev.filter(item => item !== "L") : [...prev, "L"])}>
            <p className={`${sizes.includes("L") ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>L</p>
          </div>

          <div onClick={() => setSizes(prev => prev.includes("XL") ? prev.filter(item => item !== "XL") : [...prev, "XL"])}>
            <p className={`${sizes.includes("XL") ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>XL</p>
          </div>

          <div onClick={() => setSizes(prev => prev.includes("XXL") ? prev.filter(item => item !== "XXL") : [...prev, "XXL"])}>
            <p className={`${sizes.includes("XXL") ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>XXL</p>
          </div>
        </div>
      </div>

      <div className='flex gap-2 mt-2'>
        <input onChange={() => setBestseller(prev => !prev)} checked={bestseller} type="checkbox" id='bestseller' />
        <label className='cursor-pointer' htmlFor='bestseller'>Add to bestseller</label>
      </div>

      <button type='submit' className='w-28 py-3 mt-4 bg-black text-white cursor-pointer'>ADD</button>

    </form>
  )
}

export default Add
