import { useState } from "react";
import { router, usePage } from "@inertiajs/react";
import DefaultLayout from "@/Layouts/DefaultLayout";

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
        if (confirm("Delete this permission?")) {
            router.delete(`/permissions/${id}`);
        }
    };

    return (
        <DefaultLayout>
        <div className="p-6 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold mb-4">Manage Permissions</h2>

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
                    Add Permission
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
