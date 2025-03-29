import React from "react";
import { assets } from "../assets/assets";

const orders = [
  {
    id: 1,
    image: assets.p_img1,
    items: [
      "Kid Tapered Slim Fit Trouser x 1 S",
      "Kid Tapered Slim Fit Trouser x 1 XL",
    ],
    customer: {
      name: "Abderrahmane Laajili",
      address: "Lot lmnara 2 N 63, Sidi Slimane, Rabat-Sale-Kenitra, Morocco, 14200",
    },
    totalItems: 2,
    totalPrice: "$108",
    method: "COD",
    payment: "Pending",
    date: "22/3/2025",
    status: "Packing",
  },
  {
    id: 2,
    image: assets.p_img2,
    items: ["Men Round Neck Pure Cotton T-shirt x 2 XXL"],
    customer: {
      name: "rwrrw wrwrwrw",
      address: "wrwrwr, wrwrwr, wrwrwr, fsss, 121212",
    },
    totalItems: 1,
    totalPrice: "$138",
    method: "COD",
    payment: "Pending",
    date: "22/3/2025",
    status: "Delivered",
  },
  {
    id: 3,
    image: assets.p_img3,
    items: ["Kid Tapered Slim Fit Trouser x 2 M"],
    customer: {
      name: "Kyla Metz",
      address: "94408 Franecki-Bernier Skyway, Columbia, Texas, Luxembourg, 36",
    },
    totalItems: 1,
    totalPrice: "$122",
    method: "COD",
    payment: "Pending",
    date: "22/3/2025",
    status: "Delivered",
  },
];

const Orders = () => {
  return (
    <div className="p-6 max-w-8xl mx-auto bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-semibold mb-4">Order Page</h2>
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white p-4 shadow-md rounded-lg flex items-center justify-between"
          >
            <div className="flex items-start space-x-4">
              <img
                src={order.image}
                alt="Product"
                className="w-12 h-12 object-cover"
              />
              <div>
                <p>{order.items.join(" , ")}</p>
                <p className="font-bold mt-1">{order.customer.name}</p>
                <p className="text-sm text-gray-600">{order.customer.address}</p>
                <p className="text-sm mt-1">
                  <span className="font-semibold">Items:</span> {order.totalItems} &nbsp;
                  <span className="font-semibold">Method:</span> {order.method} &nbsp;
                  <span className="font-semibold">Payment:</span> {order.payment} &nbsp;
                  <span className="font-semibold">Date:</span> {order.date}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <p className="text-lg font-semibold">{order.totalPrice}</p>
              <select
                className="border p-2 rounded-md bg-gray-100"
                defaultValue={order.status}
              >
                <option value="Packing">Packing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
