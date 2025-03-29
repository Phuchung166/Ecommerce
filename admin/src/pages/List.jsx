import React from "react";
import { assets } from "../assets/assets";

const products = [
  {
    id: 1,
    image: assets.p_img1,
    name: "Kid Tapered Slim Fit Trouser",
    category: "Kids",
    price: "$38",
  },
  {
    id: 2,
    image: assets.p_img2,
    name: "Men Round Neck Pure Cotton T-shirt",
    category: "Men",
    price: "$64",
  },
  {
    id: 3,
    image: assets.p_img3,
    name: "Boy Round Neck Pure Cotton T-shirt",
    category: "Kids",
    price: "$60",
  },
  {
    id: 4,
    image: assets.p_img4,
    name: "Women Zip-Front Relaxed Fit Jacket",
    category: "Women",
    price: "$74",
  },
  {
    id: 5,
    image: assets.p_img4,
    name: "Men Tapered Fit Flat-Front Trousers",
    category: "Men",
    price: "$58",
  },
];

const List = () => {
  return (
    <div className="p-6 max-w-8xl mx-auto bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-semibold mb-4">All Products List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Image</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Price</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t">
                <td className="px-4 py-2">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-md"
                  />
                </td>
                <td className="px-4 py-2">{product.name}</td>
                <td className="px-4 py-2">{product.category}</td>
                <td className="px-4 py-2">{product.price}</td>
                <td className="px-4 py-2">
                  <button className="text-red-500 text-lg font-bold">X</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default List;
