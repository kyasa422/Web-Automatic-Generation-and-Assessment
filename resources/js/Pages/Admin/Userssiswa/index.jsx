import React from "react";
import { usePage } from "@inertiajs/react";
import DefaultLayout from "@/Layouts/DefaultLayout";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "@inertiajs/react";

const AdminUsers = () => {
    const { userData } = usePage().props;

    // Filter hanya untuk role Siswa
    const siswaData = userData.data.filter(user => 
        user.roles.some(role => role.name === "Siswa")
    );

    return (
        <DefaultLayout>
            <div className="col-span-12 rounded-sm border border-stroke bg-white py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="flex justify-between px-7.5 mb-6">
                    <h4 className="text-xl font-semibold text-black dark:text-white">
                        Siswa
                    </h4>
                    <div>
                        <Link href="/admin/userssiswa/create">
                            <button className="bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90">
                                Tambah Siswa
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
                            {siswaData.map((user, index) => (
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
                                            <Link href={`/admin/userssiswa/${user.id}/edit`}>
                                                <FaEdit className="text-yellow-500 hover:text-yellow-700 cursor-pointer" />
                                            </Link>
                                            <Link
                                                href={`/admin/userssiswa/${user.id}`}
                                                method="delete"
                                                as="button"
                                                data={{ id: user.id }}
                                                onClick={(e) => {
                                                    if (!confirm("Apakah Anda yakin ingin menghapus data ini?")) {
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
                   {/* Pagination Controls */}
                <div className="flex justify-center gap-3 mt-4">
                    {userData.prev_page_url && (
                        <Link href={userData.prev_page_url} className="py-2 px-4 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
                            Sebelumnya
                        </Link>
                    )}
                   
                    {userData.next_page_url && (
                        <Link href={userData.next_page_url} className="py-2 px-4 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
                            Selanjutnya
                        </Link>
                    )}
                </div>
            </div>
        </DefaultLayout>
    );
};

export default AdminUsers;
