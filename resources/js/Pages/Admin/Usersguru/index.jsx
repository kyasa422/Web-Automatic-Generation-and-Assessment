import React, { useState } from "react";
import { usePage } from "@inertiajs/react";
import DefaultLayout from "@/Layouts/DefaultLayout";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "@inertiajs/react";

const AdminUsers = () => {
    const { userData, guruData, mitraData, privateData, adminData } = usePage().props;
    const [selectedRole, setSelectedRole] = useState("all");

    const handleRoleChange = (e) => {
        setSelectedRole(e.target.value);
    };

    // Pilih data yang sesuai dengan role yang dipilih
    const filteredData =
        selectedRole === "all"
            ? userData.data
            : selectedRole === "Mitra"
            ? mitraData.data
            : selectedRole === "Guru"
            ? guruData.data
            : selectedRole === "Private"
            ? privateData.data
            : adminData.data;

    return (
        <DefaultLayout>
            <div className="col-span-12 rounded-sm border border-stroke bg-white py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="flex justify-between px-7.5 mb-6">
                    <h4 className="text-xl font-semibold text-black dark:text-white">
                        Users
                    </h4>
                    <div>
                        <select
                            onChange={handleRoleChange}
                            value={selectedRole}
                            className="mr-4 px-4 py-2 rounded border dark:bg-gray-800 dark:text-white"
                        >
                            <option value="all">All Roles</option>
                            <option value="Mitra">Mitra</option>
                            <option value="Guru">Guru</option>
                            <option value="Private">Private</option>
                            <option value="Admin">Admin</option>  
                        </select>
                        <Link href="/admin/usersguru/create">
                            <button className="bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90">
                                Tambah User
                            </button>
                        </Link>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gray-2 dark:bg-meta-4">
                                <th className="py-4 px-4 text-left text-sm font-medium text-black dark:text-white pl-10">No</th>
                                <th className="py-4 px-4 text-left text-sm font-medium text-black dark:text-white">Name</th>
                                <th className="py-4 px-4 text-left text-sm font-medium text-black dark:text-white">Email</th>
                                <th className="py-4 px-4 text-left text-sm font-medium text-black dark:text-white">Role</th>
                                <th className="py-4 px-4 text-center text-sm font-medium text-black dark:text-white">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((user, index) => (
                                <tr key={user.id} className="border-b border-stroke dark:border-strokedark">
                                    <td className="py-4 px-4 pl-10 text-sm text-black dark:text-white">
                                        {userData.from + index}
                                    </td>
                                    <td className="py-4 px-4 text-sm text-black dark:text-white">
                                        {user.name}
                                    </td>
                                    <td className="py-4 px-4 text-sm text-black dark:text-white">
                                        {user.email}
                                    </td>
                                    <td className="py-4 px-4 text-sm text-black dark:text-white">
                                        {user.roles.map((role) => (
                                            <span key={role.id} className="mr-2">
                                                {role.name}
                                            </span>
                                        ))}
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                        <div className="flex justify-center gap-3">
                                            <Link href={`/admin/users/${user.id}/edit`}>
                                                <FaEdit className="text-yellow-500 hover:text-yellow-700 cursor-pointer" />
                                            </Link>
                                            <Link
                                                href={`/admin/users/${user.id}`}
                                                method="delete"
                                                as="button"
                                                data={{ id: user.id }}
                                                onClick={(e) => {
                                                    if (!confirm("Dengan Perhatian !  Jika anda menghapus data ini, maka data yang berhubungan dengan data ini juga akan terhapus. Apakah anda yakin ?")) {
                                                        e.preventDefault();
                                                    }
                                                }}
                                            >
                                                <FaTrash className="text-red-500 hover:text-red-700 cursor-pointer" />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default AdminUsers;
