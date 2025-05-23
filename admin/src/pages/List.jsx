// import React from "react";
// import { assets } from "../assets/assets";

// const products = [
//   {
//     id: 1,
//     image: assets.p_img1,
//     name: "Kid Tapered Slim Fit Trouser",
//     category: "Kids",
//     price: "$38",
//   },
//   {
//     id: 2,
//     image: assets.p_img2,
//     name: "Men Round Neck Pure Cotton T-shirt",
//     category: "Men",
//     price: "$64",
//   },
//   {
//     id: 3,
//     image: assets.p_img3,
//     name: "Boy Round Neck Pure Cotton T-shirt",
//     category: "Kids",
//     price: "$60",
//   },
//   {
//     id: 4,
//     image: assets.p_img4,
//     name: "Women Zip-Front Relaxed Fit Jacket",
//     category: "Women",
//     price: "$74",
//   },
//   {
//     id: 5,
//     image: assets.p_img4,
//     name: "Men Tapered Fit Flat-Front Trousers",
//     category: "Men",
//     price: "$58",
//   },
// ];

// const List = () => {
//   return (
//     <div className="p-6 max-w-8xl mx-auto bg-gray-100 min-h-screen">
//       <h2 className="text-2xl font-semibold mb-4">All Products List</h2>
//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
//           <thead className="bg-gray-200 text-gray-700">
//             <tr>
//               <th className="px-4 py-2 text-left">Image</th>
//               <th className="px-4 py-2 text-left">Name</th>
//               <th className="px-4 py-2 text-left">Category</th>
//               <th className="px-4 py-2 text-left">Price</th>
//               <th className="px-4 py-2 text-left">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {products.map((product) => (
//               <tr key={product.id} className="border-t">
//                 <td className="px-4 py-2">
//                   <img
//                     src={product.image}
//                     alt={product.name}
//                     className="w-12 h-12 object-cover rounded-md"
//                   />
//                 </td>
//                 <td className="px-4 py-2">{product.name}</td>
//                 <td className="px-4 py-2">{product.category}</td>
//                 <td className="px-4 py-2">{product.price}</td>
//                 <td className="px-4 py-2">
//                   <button className="text-red-500 text-lg font-bold">X</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default List;



import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import EditProduct from '../components/EditProduct'

const List = ({ token }) => {

  const [list, setList] = useState([])
  const [editProductId, setEditProductId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(18);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('')

  const fetchList = async () => {
    setLoading(true);
    try {

      const response = await axios.get(backendUrl + '/api/product/list', { params: { page, limit, search } })
      if (response.data.success) {
        setList(response.data.products)
        setTotalPages(response.data.totalPages);
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message)

    } finally {
      setLoading(false);
    }
  }

  const removeProduct = async (id) => {
    try {

      const response = await axios.post(backendUrl + '/api/product/remove', { id }, { headers: { token } })
      if (response.data.success) {
        toast.success(response.data.message)
        if (list.length === 1 && page > 1) {
          setPage(page - 1);
        } else {
          fetchList();
        }
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchList()
  }, [page, search])

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value)
    setPage(1)
  }

  return (
    <>
      <p className='mb-2'>All Products List</p>
      <div className='flex flex-col gap-2'>
        <div className="mb-4">
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Tìm kiếm theo tên"
            className="w-full max-w-md px-3 py-2 border border-gray-300 rounded"
          />
        </div>

        {/* ---------List Table Title */}
        <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border-bd bg-gray-100 text-sm'>
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className='text-center'>Action</b>
        </div>

        {/* --------- Product List----------- */}
        {
          list.map((product, index) => (
            <div key={index} className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border border-gray-200'>
              <img src={product.image[0]} alt={product.name} className='w-12 h-12 object-cover rounded-md' />
              <p>{product.name}</p>
              <p>{product.category}</p>
              <p>{product.price}</p>
              <div className='text-center flex gap-2 justify-center'>
                <button onClick={() => setEditProductId(product._id)} className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 cursor-pointer">Sửa</button>
                <button onClick={() => removeProduct(product._id)} className='bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 cursor-pointer'>Xoá</button>

              </div>
            </div>
          ))
        }
      </div>


      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 mx-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 cursor-pointer"
          >
            Trang trước
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`px-4 py-2 mx-1 ${page === index + 1 ? 'bg-pink-300 text-white cursor-pointer' : 'bg-gray-200 cursor-pointer'
                } rounded hover:bg-pink-200`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="px-4 py-2 mx-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 cursor-pointer"
          >
            Trang sau
          </button>
        </div>
      )}

      {/* Modal chỉnh sửa sản phẩm */}
      {editProductId && (
        <EditProduct
          productId={editProductId}
          token={token}
          onClose={() => setEditProductId(null)}
          onUpdate={fetchList}
        />
      )}
    </>
  )
}

export default List
