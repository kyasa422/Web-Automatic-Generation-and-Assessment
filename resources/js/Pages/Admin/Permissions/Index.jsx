import { useState } from "react";
import { router, usePage } from "@inertiajs/react";
import DefaultLayout from "@/Layouts/DefaultLayout";
import Swal from 'sweetalert2';
import { useEffect } from 'react';

export default function Index() {
    const { permissions, flash } = usePage().props;
    const [name, setName] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post("/permissions", { name }, {
            onSuccess: () => setName(""),
        });
    };

    const handleUpdate = (id, newName) => {
        router.put(`/permissions/${id}`, { name: newName });
    };

    const handleDelete = (id) => {
    Swal.fire({
        title: 'Apakah Anda yakin?',
        text: 'Data ini akan dihapus permanen!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Ya, hapus!',
        cancelButtonText: 'Batal',
    }).then((result) => {
        if (result.isConfirmed) {
            router.delete(`/permissions/${id}`, {
                onSuccess: () => {
                    Swal.fire('Berhasil!', 'Data telah dihapus.', 'success');
                },
                onError: () => {
                    Swal.fire('Gagal!', 'Terjadi kesalahan saat menghapus.', 'error');
                }
            });
        }
    });
};


    return (
        <DefaultLayout>
        <div className="p-6 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold mb-4">Kelola Kelas</h2>

            {/* {flash.success && (
                <div className="p-2 bg-green-500 text-white mb-3">
                    {flash.success}
                </div>
            )} */}

            <form onSubmit={handleSubmit} className="mb-4">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border p-2 w-full"
                    placeholder="Enter permission name"
                    required
                />
                <button type="submit" className="mt-2 p-2 bg-blue-500 text-white">
                    Tambah Kelas
                </button>
            </form>

            <table className="w-full border-collapse border">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border p-2">Name</th>
                        <th className="border p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {permissions.map((perm) => (
                        <tr key={perm.id}>
                            <td className="border p-2">
                                <input
                                    type="text"
                                    defaultValue={perm.name}
                                    onBlur={(e) => handleUpdate(perm.id, e.target.value)}
                                    className="w-full p-1 border"
                                />
                            </td>
                            <td className="border p-2">
                                <button
                                    onClick={() => handleDelete(perm.id)}
                                    className="bg-red-500 text-white p-1"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </DefaultLayout>
    );
    
}
