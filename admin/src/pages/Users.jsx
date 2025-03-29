// import React, { useState } from "react";

// const initialUsers = [
//   { id: 1, name: "John Doe", email: "john@example.com", phone: "123-456-7890", role: "Admin" },
//   { id: 2, name: "Alice Smith", email: "alice@example.com", phone: "987-654-3210", role: "User" },
//   { id: 3, name: "Bob Johnson", email: "bob@example.com", phone: "456-789-1234", role: "User" },
// ];

// const Users = () => {
//   const [users, setUsers] = useState(initialUsers);

//   const deleteUser = (id) => {
//     setUsers(users.filter(user => user.id !== id));
//   };

//   return (
//     <div className="p-6 max-w-5xl mx-auto bg-gray-100 min-h-screen">
//       <h2 className="text-2xl font-semibold mb-4">User Management</h2>
//       <div className="bg-white shadow-md rounded-lg overflow-hidden">
//         <table className="w-full border-collapse">
//           <thead>
//             <tr className="bg-gray-200">
//               <th className="p-3 text-left">ID</th>
//               <th className="p-3 text-left">Name</th>
//               <th className="p-3 text-left">Email</th>
//               <th className="p-3 text-left">Phone</th>
//               <th className="p-3 text-left">Role</th>
//               <th className="p-3 text-left">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map((user) => (
//               <tr key={user.id} className="border-b">
//                 <td className="p-3">{user.id}</td>
//                 <td className="p-3">{user.name}</td>
//                 <td className="p-3">{user.email}</td>
//                 <td className="p-3">{user.phone}</td>
//                 <td className="p-3">
//                   <span className={`px-2 py-1 text-xs font-semibold rounded ${user.role === "Admin" ? "bg-red-200 text-red-800" : "bg-blue-200 text-blue-800"}`}>
//                     {user.role}
//                   </span>
//                 </td>
//                 <td className="p-3">
//                   <button className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600">Edit</button>
//                   <button onClick={() => deleteUser(user.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Users;




import React, { useState } from "react";

const initialUsers = [
    { id: 1, name: "John Doe", email: "john@example.com", phone: "123-456-7890", role: "Admin" },
    { id: 2, name: "Alice Smith", email: "alice@example.com", phone: "987-654-3210", role: "User" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", phone: "456-789-1234", role: "User" },
];

const Users = () => {
    const [users, setUsers] = useState(initialUsers);
    const [editId, setEditId] = useState(null);
    const [editData, setEditData] = useState({ id: null, name: "", email: "", phone: "", role: "" });

    const startEdit = (user) => {
        setEditId(user.id);
        setEditData(user);
    };

    const handleEditChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    const saveEdit = () => {
        setUsers(users.map(user => (user.id === editData.id ? editData : user)));
        setEditId(null);
    };

    const cancelEdit = () => {
        setEditId(null);
    };

    const deleteUser = (id) => {
        setUsers(users.filter(user => user.id !== id));
    };

    return (
        <div className="p-6 max-w-8xl mx-auto bg-gray-100 min-h-screen">
            <h2 className="text-2xl font-semibold mb-4">User Management</h2>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-3 text-left">ID</th>
                            <th className="p-3 text-left">Name</th>
                            <th className="p-3 text-left">Email</th>
                            <th className="p-3 text-left">Phone</th>
                            <th className="p-3 text-left">Role</th>
                            <th className="p-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="border-b">
                                <td className="p-3">{user.id}</td>
                                <td className="p-3">
                                    {editId === user.id ? (
                                        <input type="text" name="name" value={editData.name} onChange={handleEditChange} className="border p-1 w-full" />
                                    ) : (
                                        user.name
                                    )}
                                </td>
                                <td className="p-3">
                                    {editId === user.id ? (
                                        <input type="email" name="email" value={editData.email} onChange={handleEditChange} className="border p-1 w-full" />
                                    ) : (
                                        user.email
                                    )}
                                </td>
                                <td className="p-3">
                                    {editId === user.id ? (
                                        <input type="text" name="phone" value={editData.phone} onChange={handleEditChange} className="border p-1 w-full" />
                                    ) : (
                                        user.phone
                                    )}
                                </td>
                                <td className="p-3">
                                    {editId === user.id ? (
                                        <select name="role" value={editData.role} onChange={handleEditChange} className="border p-1 w-full">
                                            <option value="Admin">Admin</option>
                                            <option value="User">User</option>
                                        </select>
                                    ) : (
                                        <span className={`px-2 py-1 text-xs font-semibold rounded ${user.role === "Admin" ? "bg-red-200 text-red-800" : "bg-blue-200 text-blue-800"}`}>
                                            {user.role}
                                        </span>
                                    )}
                                </td>
                                <td className="p-3">
                                    {editId === user.id ? (
                                        <>
                                            <button onClick={saveEdit} className="bg-green-500 text-white px-3 py-1 rounded mr-2 hover:bg-green-600">Save</button>
                                            <button onClick={cancelEdit} className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600">Cancel</button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => startEdit(user)} className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600">Edit</button>
                                            <button onClick={() => deleteUser(user.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Users;



// import React, { useState } from "react";

// const initialUsers = [
//     { id: 1, name: "John Doe", email: "john@example.com", phone: "123-456-7890", role: "Admin" },
//     { id: 2, name: "Alice Smith", email: "alice@example.com", phone: "987-654-3210", role: "User" },
//     { id: 3, name: "Bob Johnson", email: "bob@example.com", phone: "456-789-1234", role: "User" },
// ];

// const Users = () => {
//     const [users, setUsers] = useState(initialUsers);
//     const [editUser, setEditUser] = useState(null); // Lưu user đang chỉnh sửa

//     const startEdit = (user) => {
//         setEditUser(user);
//     };

//     const handleEditChange = (e) => {
//         setEditUser({ ...editUser, [e.target.name]: e.target.value });
//     };

//     const saveEdit = () => {
//         setUsers(users.map(user => (user.id === editUser.id ? editUser : user)));
//         setEditUser(null);
//     };

//     const cancelEdit = () => {
//         setEditUser(null);
//     };

//     const deleteUser = (id) => {
//         setUsers(users.filter(user => user.id !== id));
//     };

//     return (
//         <div className="p-6 max-w-4xl mx-auto bg-gray-100 min-h-screen">
//             <h2 className="text-2xl font-semibold mb-4">User Management</h2>

//             {/* Ẩn danh sách user nếu đang chỉnh sửa */}
//             {!editUser && (
//                 <div className="bg-white shadow-md rounded-lg overflow-hidden">
//                     <table className="w-full border-collapse">
//                         <thead>
//                             <tr className="bg-gray-200">
//                                 <th className="p-3 text-left">ID</th>
//                                 <th className="p-3 text-left">Name</th>
//                                 <th className="p-3 text-left">Email</th>
//                                 <th className="p-3 text-left">Phone</th>
//                                 <th className="p-3 text-left">Role</th>
//                                 <th className="p-3 text-left">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {users.map((user) => (
//                                 <tr key={user.id} className="border-b">
//                                     <td className="p-3">{user.id}</td>
//                                     <td className="p-3">{user.name}</td>
//                                     <td className="p-3">{user.email}</td>
//                                     <td className="p-3">{user.phone}</td>
//                                     <td className="p-3">
//                                         <span className={`px-2 py-1 text-xs font-semibold rounded ${user.role === "Admin" ? "bg-red-200 text-red-800" : "bg-blue-200 text-blue-800"}`}>
//                                             {user.role}
//                                         </span>
//                                     </td>
//                                     <td className="p-3">
//                                         <button onClick={() => startEdit(user)} className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600">Edit</button>
//                                         <button onClick={() => deleteUser(user.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             )}

//             {/* Modal chỉnh sửa user */}
//             {editUser && (
//                 <div className="fixed inset-0 flex items-center justify-center bg-opacity-50">
//                     <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//                         <h3 className="text-xl font-semibold mb-4">Edit User: {editUser.name}</h3>
//                         <div>
//                             <label className="block text-gray-700">Name</label>
//                             <input type="text" name="name" value={editUser.name} onChange={handleEditChange} className="border p-2 w-full" />
//                         </div>
//                         <div>
//                             <label className="block text-gray-700">Email</label>
//                             <input type="email" name="email" value={editUser.email} onChange={handleEditChange} className="border p-2 w-full" />
//                         </div>

//                         <div>
//                             <label className="block text-gray-700">Role</label>
//                             <select name="role" value={editUser.role} onChange={handleEditChange} className="border p-2 w-full">
//                                 <option value="Admin">Admin</option>
//                                 <option value="User">User</option>
//                             </select>
//                         </div>
//                         <div className="mt-4 flex justify-end">
//                             <button onClick={saveEdit} className="bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-600">Save</button>
//                             <button onClick={cancelEdit} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancel</button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };
//
// export default Users;



// import React, { useState } from "react";

// const initialUsers = [
//     { id: 1, name: "Nguyễn Văn A", email: "a@example.com" },
//     { id: 2, name: "Trần Thị B", email: "b@example.com" },
// ];

// const Users = () => {
//     const [users, setUsers] = useState(initialUsers);
//     const [editUser, setEditUser] = useState(null);

//     const handleEditClick = (user) => {
//         setEditUser(user);
//     };

//     const handleSave = () => {
//         setUsers(users.map((user) => (user.id === editUser.id ? editUser : user)));
//         setEditUser(null);
//     };

//     return (
//         <div className="p-5">
//             <h2 className="text-xl font-bold mb-4">Danh sách người dùng</h2>

//             {!editUser && (
//                 <table className="w-full border-collapse border border-gray-300">
//                     <thead>
//                         <tr className="bg-gray-100">
//                             <th className="border border-gray-300 p-2">ID</th>
//                             <th className="border border-gray-300 p-2">Họ & Tên</th>
//                             <th className="border border-gray-300 p-2">Email</th>
//                             <th className="border border-gray-300 p-2">Hành động</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {users.map((user) => (
//                             <tr key={user.id}>
//                                 <td className="border border-gray-300 p-2">{user.id}</td>
//                                 <td className="border border-gray-300 p-2">{user.name}</td>
//                                 <td className="border border-gray-300 p-2">{user.email}</td>
//                                 <td className="border border-gray-300 p-2">
//                                     <button
//                                         className="bg-yellow-500 text-white px-3 py-1 rounded"
//                                         onClick={() => handleEditClick(user)}
//                                     >
//                                         Sửa
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             )}

//             {editUser && (
//                 <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//                     <div className="bg-white p-5 rounded shadow-lg w-1/3">
//                         <h3 className="text-lg font-bold mb-3">Chỉnh sửa người dùng</h3>
//                         <div className="mb-3">
//                             <label className="block">Họ & Tên</label>
//                             <input
//                                 type="text"
//                                 className="border p-2 w-full"
//                                 value={editUser.name}
//                                 onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
//                             />
//                         </div>
//                         <div className="mb-3">
//                             <label className="block">Email</label>
//                             <input
//                                 type="email"
//                                 className="border p-2 w-full"
//                                 value={editUser.email}
//                                 onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
//                             />
//                         </div>
//                         <div className="flex justify-end space-x-2">
//                             <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setEditUser(null)}>
//                                 Hủy
//                             </button>
//                             <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleSave}>
//                                 Lưu
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Users;





