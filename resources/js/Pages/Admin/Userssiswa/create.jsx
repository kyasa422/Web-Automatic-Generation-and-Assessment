import React from "react";
import { useForm, usePage } from "@inertiajs/react";
import DefaultLayout from "@/Layouts/DefaultLayout";

const CreateUsers = () => {
    const { permissions } = usePage().props;  
    const { data, setData, post, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        permissions: []
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/userssiswa');
    };

    const handlePermissionChange = (e) => {
        const permissionId = parseInt(e.target.value);
        setData("permissions", e.target.checked
            ? [...data.permissions, permissionId]
            : data.permissions.filter(id => id !== permissionId)
        );
    };

    return (
        <DefaultLayout>
            <h1>Create Siswa</h1>
            <form onSubmit={handleSubmit}>
                <div className="p-6.5">
                    <div className="mb-4.5">
                        <label className="block text-sm font-medium text-black dark:text-white">
                            Name
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            placeholder="Enter name"
                            className="w-full px-5 py-3 border rounded focus:border-primary"
                        />
                        {errors.name && <div className="text-red-500">{errors.name}</div>}
                    </div>

                    <div className="mb-4.5">
                        <label className="block text-sm font-medium text-black dark:text-white">
                            Email
                        </label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            placeholder="Enter email"
                            className="w-full px-5 py-3 border rounded focus:border-primary"
                        />
                        {errors.email && <div className="text-red-500">{errors.email}</div>}
                    </div>

                    <div className="mb-4.5">
                        <label className="block text-sm font-medium text-black dark:text-white">
                            Password
                        </label>
                        <input
                            type="password"
                            value={data.password}
                            onChange={(e) => setData("password", e.target.value)}
                            placeholder="Enter Password"
                            className="w-full px-5 py-3 border rounded focus:border-primary"
                        />
                        {errors.password && <div className="text-red-500">{errors.password}</div>}
                    </div>

                    <div className="mb-4.5">
                        <label className="block text-sm font-medium text-black dark:text-white">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) => setData("password_confirmation", e.target.value)}
                            placeholder="Confirm Password"
                            className="w-full px-5 py-3 border rounded focus:border-primary"
                        />
                    </div>

                    {/* Permissions */}
                    <div className="mb-4.5">
                        <label className="block text-sm font-medium text-black dark:text-white">
                            Permissions
                        </label>
                        <div>
                            {permissions.map((permission) => (
                                <label key={permission.id} className="block">
                                    <input
                                        type="checkbox"
                                        value={permission.id}
                                        checked={data.permissions.includes(permission.id)}
                                        onChange={handlePermissionChange}
                                        className="mr-2"
                                    />
                                    {permission.name}
                                </label>
                            ))}
                        </div>
                        {errors.permissions && <div className="text-red-500">{errors.permissions}</div>}
                    </div>
                </div>
                <button type="submit" className="bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90">
                    Create Siswa
                </button>
            </form>
        </DefaultLayout>
    );
};

export default CreateUsers;
